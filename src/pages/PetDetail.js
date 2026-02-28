import { createLoader } from '../components/Loader.js'
import { supabase } from '../supabase.js'

const SPECIES_EMOJI = { dog:'🐶', cat:'🐱', rabbit:'🐰', hamster:'🐹', bird:'🐦', fish:'🐠', reptile:'🦎', other:'🐾' }

export async function renderPetDetail(main, id) {
  main.innerHTML = `<div class="container page"></div>`
  const wrap = main.querySelector('div')
  wrap.appendChild(createLoader())

  const { data: pet, error } = await supabase.from('pets').select('*').eq('id', id).single()
  wrap.innerHTML = ''

  if (error || !pet) {
    wrap.innerHTML = `<div class="empty"><div class="empty__icon">😿</div><div class="empty__text">Pet not found.</div></div>
      <div style="text-align:center;margin-top:16px"><button class="btn btn--ghost" onclick="navigate('/gallery')">← Back to Gallery</button></div>`
    return
  }

  const emoji = SPECIES_EMOJI[pet.species] || '🐾'

  wrap.innerHTML = `
    <button class="btn btn--ghost btn--sm" style="margin-bottom:32px" onclick="navigate('/gallery')">← Back</button>
    <div class="pet-detail">
      <div>
        ${pet.photo_url
          ? `<img class="pet-detail__img" src="${pet.photo_url}" alt="${pet.name}" />`
          : `<div class="pet-detail__img pet-detail__img--placeholder">${emoji}</div>`
        }
      </div>
      <div>
        <h1 class="pet-detail__name">${pet.name}</h1>
        <p class="pet-detail__owner">Owned by ${pet.owner_name}</p>
        <div class="pet-detail__tags">
          ${pet.species ? `<span class="badge">${emoji} ${pet.species}</span>` : ''}
          ${pet.breed ? `<span class="badge badge--muted">${pet.breed}</span>` : ''}
          ${pet.age ? `<span class="badge badge--muted">${pet.age} years old</span>` : ''}
        </div>
        ${pet.bio ? `<p class="pet-detail__bio">${pet.bio}</p>` : ''}
        <div class="pet-detail__info">
          ${pet.species ? `<div class="info-item"><div class="info-item__label">Species</div><div class="info-item__value">${pet.species}</div></div>` : ''}
          ${pet.breed ? `<div class="info-item"><div class="info-item__label">Breed</div><div class="info-item__value">${pet.breed}</div></div>` : ''}
          ${pet.age !== null ? `<div class="info-item"><div class="info-item__label">Age</div><div class="info-item__value">${pet.age} years</div></div>` : ''}
          ${pet.owner_name ? `<div class="info-item"><div class="info-item__label">Owner</div><div class="info-item__value">${pet.owner_name}</div></div>` : ''}
        </div>
      </div>
    </div>
  `
}
