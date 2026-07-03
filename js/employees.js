// employees.js — lógica de la página Listado de Empleados

let allEmployees = [];
let currentLetter = 'ALL';
let currentSearch = '';

function renderAlphaFilter() {
  const container = document.getElementById('alpha-filter');
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  letters.forEach((letter) => {
    const btn = document.createElement('button');
    btn.className = 'emp-alpha-btn';
    btn.dataset.letter = letter;
    btn.textContent = letter;
    container.appendChild(btn);
  });

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.emp-alpha-btn');
    if (!btn) return;

    container.querySelectorAll('.emp-alpha-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    currentLetter = btn.dataset.letter;
    renderEmployeesList();
  });
}

function getFilteredEmployees() {
  return allEmployees.filter((emp) => {
    const matchesLetter = currentLetter === 'ALL' || emp.name.toUpperCase().startsWith(currentLetter);
    const search = currentSearch.toLowerCase();
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search) ||
      emp.lastname.toLowerCase().includes(search) ||
      emp.job.toLowerCase().includes(search);
    return matchesLetter && matchesSearch;
  });
}

function renderEmployeesList() {
  const container = document.getElementById('employees-list');
  const filtered = getFilteredEmployees();

  if (filtered.length === 0) {
    container.innerHTML = '<div class="emp-empty">No se encontraron empleados.</div>';
    return;
  }

  container.innerHTML = filtered
    .map(
      (emp) => `
        <div class="db-card emp-item">
          <img class="emp-avatar" src="https://i.pravatar.cc/80?u=${emp.id}" alt="${emp.name} ${emp.lastname}" />
          <div class="emp-info">
            <div class="emp-name">${emp.name} ${emp.lastname}</div>
            <div class="emp-job">${emp.job}</div>
            <div class="emp-city">${emp.city}</div>
          </div>
          <a href="#" class="emp-details-link" data-id="${emp.id}">Detalles ›</a>
        </div>
      `
    )
    .join('');
}

function initNav() {
  const items = document.querySelectorAll('.db-nav-item');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page) window.location.href = page;
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  renderAlphaFilter();
  initNav();

  try {
    allEmployees = await getEmployees();
    renderEmployeesList();
  } catch (err) {
    console.error(err);
    document.getElementById('employees-list').innerHTML =
      '<div class="emp-empty">Error al cargar los empleados.</div>';
  }

  document.getElementById('search-input').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderEmployeesList();
  });
});