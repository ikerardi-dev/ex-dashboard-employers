// dashboard.js — lógica de la página Dashboard

const dashboardData = {
  kpis: [
    {
      label: 'Total Empleados',
      value: 150,
      sub: '+4% este mes',
      positive: true,
      subIcon: 'fa-solid fa-arrow-trend-up',
      icon: 'fa-solid fa-users',
    },
    {
      label: 'Nuevas Contrataciones',
      value: 12,
      sub: 'En proceso: 5',
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

  activity: [
    {
      icon: 'fa-solid fa-user',
      html: '<strong>Carlos Ruiz</strong> se unió al equipo de Desarrollo.',
      time: 'Hace 2 horas',
    },
    {
      icon: 'fa-solid fa-file-lines',
      html: 'Actualización de política de Trabajo Remoto.',
      time: 'Hace 5 horas',
    },
    {
      icon: 'fa-solid fa-cake-candles',
      html: 'Hoy es el cumpleaños de <strong>Elena Martínez</strong>.',
      time: 'Hace 8 horas',
    },
  ],

  events: [
    {
      month: 'Oct',
      day: 24,
      title: 'Revisión Trimestral',
      time: '10:00 AM · Sala B',
    },
  ],
};

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

function renderActivity() {
  const container = document.getElementById('activity-list');
  container.innerHTML = dashboardData.activity
    .map(
      (item) => `
        <div class="db-activity-item">
          <div class="db-activity-icon">
            <i class="${item.icon}"></i>
          </div>
          <div class="db-activity-body">
            <div class="db-activity-text">${item.html}</div>
            <div class="db-activity-time">${item.time}</div>
          </div>
          <i class="fa-solid fa-chevron-right db-activity-arrow"></i>
        </div>
      `
    )
    .join('');
}

function renderEvents() {
  const container = document.getElementById('events-list');
  container.innerHTML = dashboardData.events
    .map(
      (event) => `
        <div class="db-card db-event-card">
          <div class="db-event-date">
            <span class="db-event-month">${event.month}</span>
            <span class="db-event-day">${event.day}</span>
          </div>
          <div>
            <div class="db-event-title">${event.title}</div>
            <div class="db-event-time">${event.time}</div>
          </div>
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

document.addEventListener('DOMContentLoaded', () => {
  renderKpis();
  renderActivity();
  renderEvents();
  initNav();

  document.getElementById('add-employee-btn').addEventListener('click', () => {
    console.log('Añadir empleado');
  });

  document.getElementById('fab-btn').addEventListener('click', () => {
    console.log('FAB pulsado');
  });
});