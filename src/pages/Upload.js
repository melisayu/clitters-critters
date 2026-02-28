import { navigate } from '../router.js';
import { supabase } from '../supabase.js';

function showToast(msg, type = '') {
  let t = document.querySelector('.toast')
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t) }
  t.textContent = msg
  t.className = `toast ${type}`
  setTimeout(() => t.classList.add('show'), 10)
  setTimeout(() => { t.classList.remove('show') }, 3000)
}

export function renderUpload(main) {
  main.innerHTML = `
    <div class="container page">
      <div class="page-header">
        <h1 class="page-header__title">Add a Critter 🐾</h1>
        <p class="page-header__sub">Share your pet with the class!</p>
      </div>
      <div class="form-card">
        <form id="pet-form">
          <div class="form-group">
            <label class="form-label">Pet Photo</label>
            <div class="upload-zone" id="upload-zone">
              <div class="upload-zone__icon">📸</div>
              <div class="upload-zone__text"><strong>Click to upload</strong> or drag & drop</div>
            </div>
            <div id="preview-wrap" style="display:none" class="upload-preview">
              <img id="preview-img" src="" alt="preview" />
              <button type="button" class="upload-preview__remove" id="remove-img">×</button>
            </div>
            <input type="file" id="photo-input" accept="image/*" style="display:none" />
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label class="form-label">Pet Name *</label>
              <input class="input" style="width:100%" name="name" required placeholder="Biscuit" />
            </div>
            <div class="form-group">
              <label class="form-label">Your Name *</label>
              <input class="input" style="width:100%" name="owner_name" required placeholder="Alex" />
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label class="form-label">Species</label>
              <select class="input" style="width:100%" name="species">
                <option value="">Select species</option>
                <option value="dog">🐶 Dog</option>
                <option value="cat">🐱 Cat</option>
                <option value="rabbit">🐰 Rabbit</option>
                <option value="hamster">🐹 Hamster</option>
                <option value="bird">🐦 Bird</option>
                <option value="fish">🐠 Fish</option>
                <option value="reptile">🦎 Reptile</option>
                <option value="other">🐾 Other</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Age (years)</label>
              <input class="input" style="width:100%" name="age" type="number" min="0" max="50" placeholder="3" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Breed</label>
            <input class="input" style="width:100%" name="breed" placeholder="Golden Retriever" />
          </div>

          <div class="form-group">
            <label class="form-label">Bio</label>
            <textarea class="input textarea" name="bio" placeholder="Tell us something fun about your pet…"></textarea>
          </div>

          <button type="submit" class="btn btn--primary btn--full" id="submit-btn">Add Critter 🐾</button>
        </form>
      </div>
    </div>
  `

  let selectedFile = null
  const zone = main.querySelector('#upload-zone')
  const input = main.querySelector('#photo-input')
  const previewWrap = main.querySelector('#preview-wrap')
  const previewImg = main.querySelector('#preview-img')
  const removeBtn = main.querySelector('#remove-img')
  const form = main.querySelector('#pet-form')
  const submitBtn = main.querySelector('#submit-btn')

  function showPreview(file) {
    selectedFile = file
    const url = URL.createObjectURL(file)
    previewImg.src = url
    zone.style.display = 'none'
    previewWrap.style.display = 'block'
  }

  zone.addEventListener('click', () => input.click())
  input.addEventListener('change', e => { if (e.target.files[0]) showPreview(e.target.files[0]) })
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over') })
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'))
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over')
    if (e.dataTransfer.files[0]) showPreview(e.dataTransfer.files[0])
  })
  removeBtn.addEventListener('click', () => {
    selectedFile = null; input.value = ''
    previewWrap.style.display = 'none'; zone.style.display = 'block'
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    submitBtn.disabled = true; submitBtn.textContent = 'Uploading…'

    const fd = new FormData(form)
    let photo_url = null

    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('pet-photos')
        .upload(filename, selectedFile, { cacheControl: '3600', upsert: false })

      if (uploadErr) {
        showToast('Photo upload failed', 'error')
        submitBtn.disabled = false; submitBtn.textContent = 'Add Critter 🐾'
        return
      }

      const { data: urlData } = supabase.storage.from('pet-photos').getPublicUrl(filename)
      photo_url = urlData.publicUrl
    }

    const pet = {
      name: fd.get('name'),
      owner_name: fd.get('owner_name'),
      species: fd.get('species') || null,
      breed: fd.get('breed') || null,
      age: fd.get('age') ? Number(fd.get('age')) : null,
      bio: fd.get('bio') || null,
      photo_url,
    }

    const { error } = await supabase.from('pets').insert([pet])

    if (error) {
      showToast('Something went wrong 😿', 'error')
      submitBtn.disabled = false; submitBtn.textContent = 'Add Critter 🐾'
      return
    }

    showToast('Critter added! 🐾', 'success')
    setTimeout(() => navigate('/gallery'), 1200)
  })
}
