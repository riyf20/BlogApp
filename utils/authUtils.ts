import {jwtDecode} from 'jwt-decode';
import { useAuthStore } from '@/utils/authStore';
import { refreshExpiredToken } from '@/services/auth';

const debug = true
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

export const scheduleTokenRefresh = (token: string) => {

  if (!token) return;

  const decoded: { exp: number } = jwtDecode(token);
  const expiresAt = decoded.exp * 1000;
  const now = Date.now();
  const buffer = 2 * 60 * 1000;
  const delay = expiresAt - now - buffer;

  // {debug && console.log("scheduling refresh in:", delay / (1000 * 60), "minutes");}

  if (delay <= 0) {
    // {debug && console.log('delay passed, refreshing now')}

    refreshToken();
    return;
  }

  if (refreshTimeout) {
    clearTimeout(refreshTimeout)
  }

  refreshTimeout = setTimeout(() => {
    // {debug && console.log("timeout triggered, refreshing now")}
    refreshToken();
  }, delay);
};

export const refreshToken = async () => {
  // {debug && console.log("refreshToken called")}

  // Does not need to refresh for guest
  if(useAuthStore.getState().username !== 'guest' && useAuthStore.getState().user.isGuest) {
    try {
      const {
        refreshToken: refresh,
        username,
        user,
        changeToken,
        logOut
      } = useAuthStore.getState()

      const userID = user?.id;

      const data = await refreshExpiredToken(refresh, userID, username);

      if (data.newToken) {
        // {debug && console.log("new token granted")}
        changeToken(data.newToken);
        scheduleTokenRefresh(data.newToken);
      }
    } catch (err:any) {
      // Will logout if refreshtoken itself is expired
      if(err.message==='Refresh token expired or invalid') {
        useAuthStore.getState().logOut();
      }
      console.log(err)
    }
  }
};

export const clearRefreshTimeout = () => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
};