import { createCard } from '../components/Card.js'
import { createLoader } from '../components/Loader.js'
import { supabase } from '../supabase.js'

export async function renderGallery(main) {
  main.innerHTML = `
    <div class="container page">
      <div class="page-header">
        <h1 class="page-header__title">All Critters 🐾</h1>
        <p class="page-header__sub">Every pet from our class, all in one place.</p>
      </div>
      <div class="filter-bar">
        <input class="input input--search" id="search" placeholder="Search by name, breed…" />
        <select class="input input--select" id="species-filter">
          <option value="">All species</option>
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
      <div id="grid" class="grid grid--3"></div>
    </div>
  `

  let allPets = []
  const grid = main.querySelector('#grid')
  const search = main.querySelector('#search')
  const speciesFilter = main.querySelector('#species-filter')

  grid.appendChild(createLoader())

  const { data, error } = await supabase.from('pets').select('*').order('created_at', { ascending: false })
  grid.innerHTML = ''

  if (error) { grid.innerHTML = `<p style="color:var(--muted)">Error loading pets.</p>`; return }
  allPets = data || []

  function render(pets) {
    grid.innerHTML = ''
    if (!pets.length) {
      grid.innerHTML = `<div class="empty"><div class="empty__icon">🔍</div><div class="empty__text">No critters match your search.</div></div>`
      return
    }
    pets.forEach(pet => grid.appendChild(createCard(pet)))
  }

  function filter() {
    const q = search.value.toLowerCase()
    const species = speciesFilter.value
    render(allPets.filter(p =>
      (!q || p.name?.toLowerCase().includes(q) || p.breed?.toLowerCase().includes(q) || p.owner_name?.toLowerCase().includes(q)) &&
      (!species || p.species === species)
    ))
  }

  search.addEventListener('input', filter)
  speciesFilter.addEventListener('change', filter)
  render(allPets)
}
