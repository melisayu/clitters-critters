import { renderGallery } from './pages/Gallery.js'
import { renderHome } from './pages/Home.js'
import { renderPetDetail } from './pages/PetDetail.js'
import { renderUpload } from './pages/Upload.js'

const routes = {
  '/': renderHome,
  '/gallery': renderGallery,
  '/upload': renderUpload,
}

export function navigate(path) {
  window.history.pushState({}, '', path)
  renderPage()
}

export function renderPage() {
  const path = window.location.pathname
  const main = document.getElementById('main')

  // Pet detail route
  const detailMatch = path.match(/^\/pet\/(.+)$/)
  if (detailMatch) {
    renderPetDetail(main, detailMatch[1])
    return
  }

  const render = routes[path] || renderHome
  render(main)
}

window.addEventListener('popstate', renderPage)

// Make navigate global for inline onclick use
window.navigate = navigate
