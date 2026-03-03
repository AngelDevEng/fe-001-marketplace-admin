/**
 * Validation utilities to maintain 1:1 parity with legacy requirements
 */

export const validateRUC = (ruc: string): boolean => {
    return ruc.length === 11 && /^\d+$/.test(ruc);
};

export const validateDNI = (dni: string): boolean => {
    return dni.length === 8 && /^\d+$/.test(dni);
};

export const validateBCPAccount = (account: string): boolean => {
    return account.length === 14 && /^\d+$/.test(account);
};

export const validateCCI = (cci: string): boolean => {
    return cci.length === 20 && /^\d+$/.test(cci);
};

export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const allowOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
        e.preventDefault();
    }
};
