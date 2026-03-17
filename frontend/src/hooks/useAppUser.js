import { useAuth } from './useAuth';
import { useGuest } from '../context/GuestContext';

export function useAppUser() {
  const auth = useAuth();
  const guestCtx = useGuest();

  if (guestCtx?.isGuest) {
    return {
      user: guestCtx.guestUser,
      session: null,
      loading: false,
      isGuest: true
    };
  }

  return {
    user: auth?.user || null,
    session: auth?.session || null,
    loading: auth?.loading || false,
    isGuest: false
  };
}
