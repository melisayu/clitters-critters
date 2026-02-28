
export function renderNavbar(el) {
  el.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <div class="navbar__inner">
          <div class="navbar__logo" onclick="navigate('/')">
            <span>🐾</span> Clitters Critters
          </div>
          <div class="navbar__nav">
            <button class="navbar__link" onclick="navigate('/')">Home</button>
            <button class="navbar__link" onclick="navigate('/gallery')">Gallery</button>
            <button class="navbar__cta" onclick="navigate('/upload')">+ Add Pet</button>
          </div>
        </div>
      </div>
    </nav>
  `
  // Highlight active link
  function setActive() {
    el.querySelectorAll('.navbar__link').forEach(btn => {
      btn.classList.remove('active')
      if (window.location.pathname === '/' && btn.textContent === 'Home') btn.classList.add('active')
      if (window.location.pathname === '/gallery' && btn.textContent === 'Gallery') btn.classList.add('active')
    })
  }
  setActive()
  window.addEventListener('popstate', setActive)
}
