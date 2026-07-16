import { getEmployees } from './employeesapi.js';
import { initLogout } from './logout.js';

const EVENTS_STORAGE_KEY = 'hr-dashboard-events';

const dashboardData = {
  kpis: [
    {
      label: 'Total Empleados',
      value: 10,
      sub: '+11% este mes',
      positive: true,
      subIcon: 'fa-solid fa-arrow-trend-up',
      icon: 'fa-solid fa-users',
    },
    {
      label: 'Nuevas Contrataciones',
      value: 5,
      sub: 'En proceso: 2',
      positive: false,
      subIcon: 'fa-solid fa-circle-check',
      icon: 'fa-solid fa-user-plus',
    },
    {
      label: 'Departamentos',
      value: 8,
      sub: 'Activos y operativos',
      positive: false,
      subIcon: null,
      icon: 'fa-solid fa-diagram-project',
    },
  ],
};

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

let employeesCache = [];

// ─── Eventos: almacenamiento en localStorage ───────────

export function getEvents() {
  const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveEvents(events) {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
}

export function addEvent(event) {
  const events = getEvents();
  events.push({ id: Date.now().toString(), ...event });
  saveEvents(events);
}

export function removeEvent(id) {
  const events = getEvents().filter((e) => e.id !== id);
  saveEvents(events);
}

export function getUpcomingEvents() {
  const now = new Date();
  return getEvents()
    .map((e) => ({ ...e, dateObj: new Date(`${e.date}T${e.time || '00:00'}`) }))
    .filter((e) => e.dateObj >= now || e.date === now.toISOString().slice(0, 10))
    .sort((a, b) => a.dateObj - b.dateObj);
}

// ─── Render ─────────────────────────────────────────────

function renderKpis() {
  const container = document.getElementById('kpi-list');
  container.innerHTML = dashboardData.kpis
    .map((kpi) => {
      const subClass = kpi.positive ? 'db-kpi-sub positive' : 'db-kpi-sub';
      const subIcon = kpi.subIcon ? `<i class="${kpi.subIcon}"></i>` : '';
      return `
        <div class="db-card db-kpi-card">
          <div class="db-kpi-info">
            <span class="db-kpi-label">${kpi.label}</span>
            <span class="db-kpi-value">${kpi.value}</span>
            <span class="${subClass}">${subIcon}${kpi.sub}</span>
          </div>
          <div class="db-icon-badge">
            <i class="${kpi.icon}"></i>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderEvents() {
  const container = document.getElementById('events-list');
  const events = getUpcomingEvents();

  if (events.length === 0) {
    container.innerHTML = '<div class="emp-empty">No hay eventos próximos.</div>';
    return;
  }

  container.innerHTML = events
    .map((event) => {
      const month = MONTH_NAMES[event.dateObj.getMonth()];
      const day = event.dateObj.getDate();
      const timeLabel = event.time
        ? new Date(`1970-01-01T${event.time}`).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';
      const title = `${event.type} de ${event.employeeName}`;
      const sub = [timeLabel, event.description].filter(Boolean).join(' · ');

      return `
        <div class="db-card db-event-card">
          <div class="db-event-date">
            <span class="db-event-month">${month}</span>
            <span class="db-event-day">${day}</span>
          </div>
          <div style="flex: 1;">
            <div class="db-event-title">${title}</div>
            <div class="db-event-time">${sub}</div>
          </div>
          <button class="db-event-delete" data-id="${event.id}" aria-label="Eliminar evento">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('.db-event-delete').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeEvent(btn.dataset.id);
      renderEvents();
    });
  });
}

// ─── Añadir Evento ───────────────────────────

async function populateEmployeeSelect() {
  const select = document.getElementById('event-employee');
  try {
    employeesCache = await getEmployees();
    select.innerHTML = employeesCache
      .map((emp) => `<option value="${emp.id}">${emp.name} ${emp.lastname}</option>`)
      .join('');
  } catch (err) {
    console.error(err);
    select.innerHTML = '<option value="" disabled>Error al cargar empleados</option>';
  }
}

function openEventModal() {
  document.getElementById('event-modal-overlay').classList.add('visible');
}

function closeEventModal() {
  document.getElementById('event-modal-overlay').classList.remove('visible');
  document.getElementById('event-form').reset();
}

function initEventModal() {
  document.getElementById('add-event-btn').addEventListener('click', openEventModal);
  document.getElementById('fab-btn').addEventListener('click', openEventModal);
  document.getElementById('event-modal-close').addEventListener('click', closeEventModal);

  document.getElementById('event-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'event-modal-overlay') closeEventModal();
  });

  document.getElementById('event-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const employeeId = document.getElementById('event-employee').value;
    const employee = employeesCache.find((emp) => String(emp.id) === String(employeeId));

    addEvent({
      type: document.getElementById('event-type').value,
      employeeId,
      employeeName: employee ? `${employee.name} ${employee.lastname}` : 'Empleado',
      date: document.getElementById('event-date').value,
      time: document.getElementById('event-time').value,
      description: document.getElementById('event-description').value,
    });

    closeEventModal();
    renderEvents();
  });
}

// ─── Nav ────────────────────────────────────────────────

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
  renderKpis();
  renderEvents();
  initNav();
  initEventModal();
  populateEmployeeSelect();
});