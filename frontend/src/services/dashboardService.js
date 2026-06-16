import api from './api';

export const getDashboardSummary = (params = {}) => api.get('/dashboard/summary', { params });
export const getSpendingByCategory = (params = {}) => api.get('/dashboard/by-category', { params });
export const getSpendingOverTime = (params = {}) => api.get('/dashboard/over-time', { params });
