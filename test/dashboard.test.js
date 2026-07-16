import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getEvents, saveEvents, addEvent, removeEvent, getUpcomingEvents } from '../js/dashboard.js';

beforeEach(() => {
  localStorage.clear();
});

describe('getEvents / saveEvents', () => {
  it('devuelve un array vacío si no hay nada guardado', () => {
    expect(getEvents()).toEqual([]);
  });

  it('guarda y recupera eventos correctamente', () => {
    const events = [{ id: '1', type: 'Reunión' }];
    saveEvents(events);
    expect(getEvents()).toEqual(events);
  });
});

describe('addEvent', () => {
  it('añade un evento con un id generado', () => {
    addEvent({ type: 'Cumpleaños', employeeName: 'Ana López', date: '2026-08-01', time: '10:00' });
    const events = getEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: 'Cumpleaños', employeeName: 'Ana López' });
    expect(events[0].id).toBeDefined();
  });

  it('acumula varios eventos sin sobrescribir los anteriores', () => {
    addEvent({ type: 'Reunión', employeeName: 'A' });
    addEvent({ type: 'Reunión', employeeName: 'B' });
    expect(getEvents()).toHaveLength(2);
  });
});

describe('removeEvent', () => {
  it('elimina solo el evento con el id indicado', () => {
    saveEvents([
      { id: '1', type: 'Reunión' },
      { id: '2', type: 'Cumpleaños' },
    ]);
    removeEvent('1');
    const events = getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe('2');
  });

  it('no falla si el id no existe', () => {
    saveEvents([{ id: '1', type: 'Reunión' }]);
    removeEvent('no-existe');
    expect(getEvents()).toHaveLength(1);
  });
});

describe('getUpcomingEvents', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-14T12:00:00'));
  });

  it('filtra los eventos que ya pasaron', () => {
    saveEvents([
      { id: '1', date: '2026-07-01', time: '09:00' }, // pasado
      { id: '2', date: '2026-08-01', time: '09:00' }, // futuro
    ]);
    const upcoming = getUpcomingEvents();
    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].id).toBe('2');
  });

  it('ordena los eventos futuros por fecha ascendente', () => {
    saveEvents([
      { id: 'later', date: '2026-09-01', time: '09:00' },
      { id: 'sooner', date: '2026-08-01', time: '09:00' },
    ]);
    const upcoming = getUpcomingEvents();
    expect(upcoming.map((e) => e.id)).toEqual(['sooner', 'later']);
  });

  it('incluye eventos de hoy aunque la hora ya haya pasado', () => {
    saveEvents([{ id: 'hoy', date: '2026-07-14', time: '01:00' }]);
    const upcoming = getUpcomingEvents();
    expect(upcoming).toHaveLength(1);
  });
});