// Apply the persisted theme before first paint to avoid a flash.
// Lives as a static file (not inline) so the Content-Security-Policy can be
// a strict `script-src 'self'` with no unsafe-inline exceptions.
try {
  document.documentElement.dataset.theme = localStorage.getItem('fleeter-theme') || 'dark'
} catch (e) {
  document.documentElement.dataset.theme = 'dark'
}
