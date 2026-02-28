import { renderNavbar } from './components/Navbar.js'
import { renderPage } from './router.js'
import './style.css'

const app = document.getElementById('app')
app.innerHTML = `
  <div id="navbar"></div>
  <main id="main"></main>
`

renderNavbar(document.getElementById('navbar'))
renderPage()
