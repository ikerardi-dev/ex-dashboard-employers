const EMPLOYEES_API_URL = 'https://jsonplaceholder.typicode.com/users';

export function normalizeUser(user) {
  const [name, ...rest] = user.name.split(' ');
  return {
    id: user.id,
    name,
    lastname: rest.join(' ') || '—',
    job: user.company?.name || 'Sin puesto asignado',
    city: user.address?.city || 'Sin ciudad',
  };
}

export async function getEmployees() {
  const res = await fetch(EMPLOYEES_API_URL);
  if (!res.ok) throw new Error('Error al obtener empleados');
  const users = await res.json();
  return users.map(normalizeUser);
}

export async function getEmployeeById(id) {
  const res = await fetch(`${EMPLOYEES_API_URL}/${id}`);
  if (!res.ok) throw new Error('Empleado no encontrado');
  const user = await res.json();
  return normalizeUser(user);
}

export async function createEmployee({ name, lastname, job, city }) {
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

export async function updateEmployee(id, { name, lastname, job, city }) {
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

export async function deleteEmployee(id) {
  const res = await fetch(`${EMPLOYEES_API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar empleado');
  return res.json();
}