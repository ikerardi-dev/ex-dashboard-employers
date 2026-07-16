

export function initLogout() {
  const btn = document.getElementById('logout-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    localStorage.removeItem('hr-current-user');
    window.location.href = '../login.html';
});
}

document.addEventListener('DOMContentLoaded', initLogout);