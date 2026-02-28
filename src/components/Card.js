import { navigate } from '../router.js'

const SPECIES_EMOJI = {
  dog: '🐶', cat: '🐱', rabbit: '🐰', hamster: '🐹',
  bird: '🐦', fish: '🐠', reptile: '🦎', other: '🐾'
}

export function createCard(pet) {
  const card = document.createElement('div')
  card.className = 'card'
  card.onclick = () => navigate(`/pet/${pet.id}`)

  const emoji = SPECIES_EMOJI[pet.species] || '🐾'

  card.innerHTML = `
    ${pet.photo_url
      ? `<img class="card__img" src="${pet.photo_url}" alt="${pet.name}" loading="lazy" />`
      : `<div class="card__img card__img--placeholder">${emoji}</div>`
    }
    <div class="card__body">
      <div class="card__name">${pet.name}</div>
      <div class="card__meta">${pet.species || 'Unknown'} · ${pet.owner_name}</div>
      <div class="card__tags">
        ${pet.age ? `<span class="badge badge--muted">${pet.age}y</span>` : ''}
        ${pet.breed ? `<span class="badge">${pet.breed}</span>` : ''}
      </div>
    </div>
  `
  return card
}
