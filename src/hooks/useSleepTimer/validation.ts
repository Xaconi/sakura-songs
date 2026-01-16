import type { ValidationResult } from './types';
import { MIN_MINUTES, MAX_MINUTES } from './constants';

export function validateCustomTime(value: string | null | undefined): ValidationResult {
  if (value === '' || value === null || value === undefined) {
    return { valid: false, error: 'Introduce un numero' };
  }

  const num = parseInt(value, 10);

  if (isNaN(num)) {
    return { valid: false, error: 'Introduce un numero valido' };
  }
  if (num < MIN_MINUTES) {
    return { valid: false, error: 'El tiempo debe ser mayor a 0' };
  }
  if (num > MAX_MINUTES) {
    return { valid: false, error: `Maximo ${MAX_MINUTES} minutos (8 horas)` };
  }
  if (!Number.isInteger(Number(value))) {
    return { valid: false, error: 'Introduce un numero entero' };
  }

  return { valid: true };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
