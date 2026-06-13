document.addEventListener('DOMContentLoaded', () => {


  const isLogged = localStorage.getItem('isAuthenticated');
  if (isLogged === 'true') {
    window.location.href = '/html/landing.html';
    return;
  }

  
  const form       = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const pwInput    = document.getElementById('password');
  const toggleBtn  = document.getElementById('togglePw');
  const eyeIcon    = document.getElementById('eyeIcon');
  const errorMsg   = document.getElementById('error-msg');


  toggleBtn.addEventListener('click', () => {
    const isHidden = pwInput.type === 'password';
    pwInput.type      = isHidden ? 'text' : 'password';
    eyeIcon.className = isHidden ? 'ti ti-eye-off' : 'ti ti-eye';
    toggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });


  [emailInput, pwInput].forEach(input => {
    input.addEventListener('input', () => hideError());
  });


  form.addEventListener('submit', (e) => {
    e.preventDefault(); // evitamos el POST al servidor

    const email = emailInput.value.trim();
    const pw    = pwInput.value.trim();


    if (!email || !pw) {
      showError('Por favor completa todos los campos.');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Introduce un email válido.');
      return;
    }

    
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userEmail', email);
    window.location.href = '/html/landing.html';
  });


  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add('visible');
  }

  function hideError() {
    errorMsg.textContent = '';
    errorMsg.classList.remove('visible');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});