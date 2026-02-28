import { createCard } from '../components/Card.js'
import { createLoader } from '../components/Loader.js'
import { supabase } from '../supabase.js'

export async function renderHome(main) {
  main.innerHTML = `
    <div class="container page">
      <section class="hero">
        <div class="hero__emoji">🐾</div>
        <h1 class="hero__title">The <em>Pokedex</em> for<br>clitters</h1>
        <p class="hero__sub">Meet every fluffy, scaly, and feathery friend from our classroom community.</p>
        <div class="hero__actions">
          <button class="btn btn--primary" onclick="navigate('/gallery')">Browse All Pets</button>
          <button class="btn btn--ghost" onclick="navigate('/upload')">+ Add Your Pet</button>
        </div>
      </section>
      <div id="stats" class="stats">
        <div class="stat"><div class="stat__num">—</div><div class="stat__label">Pets</div></div>
        <div class="stat"><div class="stat__num">—</div><div class="stat__label">Species</div></div>
        <div class="stat"><div class="stat__num">—</div><div class="stat__label">Owners</div></div>
      </div>
      <section class="section">
        <div class="section__header">
          <h2 class="section__title">Recently added 🆕</h2>
          <button class="btn btn--ghost btn--sm" onclick="navigate('/gallery')">View all →</button>
        </div>
        <div id="recent" class="grid grid--3"></div>
      </section>
    </div>
  `

  const recentEl = main.querySelector('#recent')
  const statsEl = main.querySelector('#stats')
  recentEl.appendChild(createLoader())

  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  recentEl.innerHTML = ''
  if (error || !data?.length) {
    recentEl.innerHTML = `<div class="empty"><div class="empty__icon">🌱</div><div class="empty__text">No pets yet — be the first to add one!</div></div>`
    return
  }

  data.forEach(pet => recentEl.appendChild(createCard(pet)))

  // Stats
  const { count: petCount } = await supabase.from('pets').select('*', { count: 'exact', head: true })
  const { data: speciesData } = await supabase.from('pets').select('species')
  const uniqueSpecies = new Set(speciesData?.map(p => p.species).filter(Boolean)).size
  const { data: ownersData } = await supabase.from('pets').select('owner_name')
  const uniqueOwners = new Set(ownersData?.map(p => p.owner_name).filter(Boolean)).size

  statsEl.innerHTML = `
    <div class="stat"><div class="stat__num">${petCount || 0}</div><div class="stat__label">Pets</div></div>
    <div class="stat"><div class="stat__num">${uniqueSpecies}</div><div class="stat__label">Species</div></div>
    <div class="stat"><div class="stat__num">${uniqueOwners}</div><div class="stat__label">Owners</div></div>
  `
}
