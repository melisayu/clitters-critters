export function createBadge(text, muted = false) {
  const el = document.createElement('span')
  el.className = `badge${muted ? ' badge--muted' : ''}`
  el.textContent = text
  return el
}
