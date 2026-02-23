import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginCredentials, LoginResponse } from '@/lib/types/auth';

interface UseLoginReturn {
    login: (credentials: LoginCredentials) => Promise<LoginResponse>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

export function useLogin(): UseLoginReturn {
    const { login: authLogin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const validateCredentials = (credentials: LoginCredentials): string | null => {
        if (!credentials.username || credentials.username.trim().length === 0) {
            return 'El correo electrónico es requerido';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.username)) {
            return 'Ingresa un correo electrónico válido';
        }

        if (!credentials.password || credentials.password.length === 0) {
            return 'La contraseña es requerida';
        }

        if (credentials.password.length < 4) {
            return 'La contraseña debe tener al menos 4 caracteres';
        }

        return null;
    };

    const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResponse> => {
        setIsLoading(true);
        setError(null);

        const validationError = validateCredentials(credentials);
        if (validationError) {
            setIsLoading(false);
            setError(validationError);
            return { success: false, error: validationError };
        }

        try {
            await authLogin(credentials);
            
            return { 
                success: true, 
                message: 'Login exitoso. Redirigiendo...' 
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error de conexión. Intenta nuevamente.';
            setError(errorMessage);
            return { 
                success: false, 
                error: errorMessage 
            };
        } finally {
            setIsLoading(false);
        }
    }, [authLogin]);

    return {
        login,
        isLoading,
        error,
        clearError,
    };
}
