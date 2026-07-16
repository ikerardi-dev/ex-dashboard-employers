import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { normalizeUser, getEmployees, getEmployeeById, deleteEmployee } from '../js/employeesapi.js';

const mockUser = {
  id: 1,
  name: 'Leanne Graham',
  company: { name: 'Romaguera-Crona' },
  address: { city: 'Gwenborough' },
};

describe('normalizeUser', () => {
  it('separa nombre y apellido correctamente', () => {
    const result = normalizeUser(mockUser);
    expect(result).toEqual({
      id: 1,
      name: 'Leanne',
      lastname: 'Graham',
      job: 'Romaguera-Crona',
      city: 'Gwenborough',
    });
  });

  it('usa valores por defecto si faltan company o address', () => {
    const result = normalizeUser({ id: 2, name: 'Ana' });
    expect(result.lastname).toBe('—');
    expect(result.job).toBe('Sin puesto asignado');
    expect(result.city).toBe('Sin ciudad');
  });
});

describe('getEmployees / getEmployeeById / deleteEmployee', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getEmployees devuelve la lista normalizada', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
    });

    const employees = await getEmployees();
    expect(employees).toEqual([
      { id: 1, name: 'Leanne', lastname: 'Graham', job: 'Romaguera-Crona', city: 'Gwenborough' },
    ]);
  });

  it('getEmployees lanza error si la respuesta no es ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(getEmployees()).rejects.toThrow('Error al obtener empleados');
  });

  it('getEmployeeById devuelve un empleado normalizado', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUser });
    const employee = await getEmployeeById(1);
    expect(employee.name).toBe('Leanne');
  });

  it('getEmployeeById lanza error si no se encuentra', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(getEmployeeById(999)).rejects.toThrow('Empleado no encontrado');
  });

  it('deleteEmployee lanza error si la respuesta no es ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(deleteEmployee(1)).rejects.toThrow('Error al eliminar empleado');
  });
});