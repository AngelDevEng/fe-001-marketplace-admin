// ============================================
// LIB — API Client
// Equivalente a api.config.js
// La URL base se define via variable de entorno NEXT_PUBLIC_API_BASE
// ============================================

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

// Lee el token Laravel de la cookie (cuando exista)
// Con PHP no hay token, retorna null y no afecta nada
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof document !== 'undefined') {
    const token = document.cookie.match(/(?:^|;\s*)laravel_token=([^;]+)/)?.[1];
    if (token) headers['Authorization'] = `Bearer ${decodeURIComponent(token)}`;
  }
  return headers;
}

async function apiCall<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(API_BASE + endpoint, {
      headers: getAuthHeaders(),
      ...options,
    });
    const text = await res.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      console.error(`API Error [${endpoint}] — Respuesta no es JSON:\n${text}`);
      return { success: false, message: 'Error del servidor. Ver consola para detalles.' } as T;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error(`API Error [${endpoint}]:`, err);
    return { success: false, message } as T;
  }
}

export function apiGet<T = unknown>(endpoint: string): Promise<T> {
  return apiCall<T>(endpoint, { method: 'GET' });
}

export function apiPost<T = unknown>(endpoint: string, data: unknown): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function apiDelete<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'DELETE',
    body: JSON.stringify(data),
  });
}

export function getSSEUrl(canal: string, usuarioId: string): string {
  return `${API_BASE}/eventos.php?canal=${canal}&usuario_id=${usuarioId}`;
}

// Post silencioso — no loggea errores (para broadcasts opcionales)
export async function silentPost(endpoint: string, data: unknown): Promise<void> {
  try {
    await fetch((process.env.NEXT_PUBLIC_API_BASE ?? '/api') + endpoint, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  } catch { /* silencioso */ }
}

export { API_BASE };