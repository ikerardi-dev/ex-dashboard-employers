import { describe, it, expect, beforeEach } from 'vitest';
import {
  assignAvatars,
  getFilteredEmployees,
  __setEmployeesForTest,
  __setFilterStateForTest,
  __getAvatarMapForTest,
} from '../js/employees.js';

const sampleEmployees = [
  { id: 1, name: 'Ana', lastname: 'García', job: 'Diseñadora', city: 'Madrid' },
  { id: 2, name: 'Berto', lastname: 'Ruiz', job: 'Desarrollador', city: 'Oviedo' },
  { id: 3, name: 'Ana', lastname: 'López', job: 'Backend', city: 'Gijón' },
];

beforeEach(() => {
  __setEmployeesForTest(sampleEmployees);
  __setFilterStateForTest('ALL', '');
});

describe('assignAvatars', () => {
  it('asigna un número de avatar (1-70) a cada empleado según su índice', () => {
    assignAvatars(sampleEmployees);
    const map = __getAvatarMapForTest();
    expect(map[1]).toBe(1);
    expect(map[2]).toBe(2);
    expect(map[3]).toBe(3);
  });
});

describe('getFilteredEmployees', () => {
  it('devuelve todos los empleados si el filtro es ALL y no hay búsqueda', () => {
    expect(getFilteredEmployees()).toHaveLength(3);
  });

  it('filtra por letra inicial del nombre', () => {
    __setFilterStateForTest('A', '');
    const result = getFilteredEmployees();
    expect(result).toHaveLength(2);
    expect(result.every((e) => e.name.startsWith('A'))).toBe(true);
  });

  it('filtra por texto de búsqueda en nombre, apellido o puesto', () => {
    __setFilterStateForTest('ALL', 'ruiz');
    const result = getFilteredEmployees();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('combina letra y búsqueda a la vez', () => {
    __setFilterStateForTest('A', 'backend');
    const result = getFilteredEmployees();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it('devuelve un array vacío si nada coincide', () => {
    __setFilterStateForTest('Z', '');
    expect(getFilteredEmployees()).toEqual([]);
  });
});