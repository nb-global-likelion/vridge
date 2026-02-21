import { create } from 'zustand';

interface AuthModalStore {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  openLogin: () => void;
  openSignup: () => void;
  closeAll: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isLoginOpen: false,
  isSignupOpen: false,
  openLogin: () => set({ isLoginOpen: true, isSignupOpen: false }),
  openSignup: () => set({ isSignupOpen: true, isLoginOpen: false }),
  closeAll: () => set({ isLoginOpen: false, isSignupOpen: false }),
}));
