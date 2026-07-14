const EMPLOYEES_API_URL = 'https://jsonplaceholder.typicode.com/users';

function normalizeUser(user) {
  const [name, ...rest] = user.name.split(' ');
  return {
    id: user.id,
    name,
    lastname: rest.join(' ') || '—',
    job: user.company?.name || 'Sin puesto asignado',
    city: user.address?.city || 'Sin ciudad',
  };
}

async function getEmployees() {
  const res = await fetch(EMPLOYEES_API_URL);
  if (!res.ok) throw new Error('Error al obtener empleados');
  const users = await res.json();
  return users.map(normalizeUser);
}

async function getEmployeeById(id) {
  const res = await fetch(`${EMPLOYEES_API_URL}/${id}`);
  if (!res.ok) throw new Error('Empleado no encontrado');
  const user = await res.json();
  return normalizeUser(user);
}

// Nota: jsonplaceholder simula estas operaciones (responde OK) pero no
// persiste realmente los cambios en su servidor.
async function createEmployee({ name, lastname, job, city }) {
  const res = await fetch(EMPLOYEES_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `${name} ${lastname}`,
      company: { name: job },
      address: { city },
    }),
  });
  if (!res.ok) throw new Error('Error al crear empleado');
  return res.json();
}

async function updateEmployee(id, { name, lastname, job, city }) {
  const res = await fetch(`${EMPLOYEES_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `${name} ${lastname}`,
      company: { name: job },
      address: { city },
    }),
  });
  if (!res.ok) throw new Error('Error al actualizar empleado');
  return res.json();
}

async function deleteEmployee(id) {
  const res = await fetch(`${EMPLOYEES_API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar empleado');
  return res.json();
}