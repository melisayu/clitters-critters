export function createLoader() {
  const el = document.createElement('div')
  el.className = 'loader'
  el.innerHTML = `<div class="loader__ring"></div>`
  return el
}
