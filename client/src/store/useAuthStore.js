import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('nyayvivek_user')) || null,
  isAuthenticated: !!localStorage.getItem('nyayvivek_user'),
  
  login: (userData) => {
    localStorage.setItem('nyayvivek_user', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('nyayvivek_user');
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
