import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initLogout } from '../js/logout.js';

describe('initLogout', () => {
  beforeEach(() => {
    document.body.innerHTML = '<button id="logout-btn"></button>';
    localStorage.setItem('hr-current-user', 'algun-usuario');


    delete window.location;
    window.location = { href: '' };
  });

  it('no falla si no existe el botón en el DOM', () => {
    document.body.innerHTML = '';
    expect(() => initLogout()).not.toThrow();
  });

  it('al hacer click, limpia la sesión y redirige a login.html', () => {
    initLogout();
    document.getElementById('logout-btn').click();

    expect(localStorage.getItem('hr-current-user')).toBeNull();
    expect(window.location.href).toBe('login.html');
  });
});