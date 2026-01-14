export const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
};

export const setupAuthListeners = () => {
    window.addEventListener('beforeunload', clearAuth);
    return () => window.removeEventListener('beforeunload', clearAuth);
};