import { describe, it, expect } from 'vitest';
import { normalizeError } from '../src/api/apiClient';
import { AxiosError } from 'axios';

describe('normalizeError', () => {
  it('handles non-axios errors', () => {
    const result = normalizeError(new Error('Something broke'));
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe('Something broke');
  });

  it('handles non-Error values', () => {
    const result = normalizeError('string error');
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe('An unexpected error occurred');
  });

  it('handles axios error with structured API response', () => {
    const error = new AxiosError('fail', '400', undefined, undefined, {
      status: 400,
      data: {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: [{ field: 'email', message: 'Required' }],
        },
      },
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    });
    const result = normalizeError(error);
    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.message).toBe('Invalid input');
    expect(result.details).toHaveLength(1);
    expect(result.statusCode).toBe(400);
  });

  it('handles axios network error (no response)', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK');
    const result = normalizeError(error);
    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.statusCode).toBe(0);
  });

  it('handles axios timeout error', () => {
    const error = new AxiosError('timeout', 'ECONNABORTED');
    const result = normalizeError(error);
    expect(result.code).toBe('TIMEOUT_ERROR');
  });
});
