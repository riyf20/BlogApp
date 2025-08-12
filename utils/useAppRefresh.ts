import { AppState } from 'react-native';
import { useEffect, useRef } from 'react';
import { useAuthStore } from './authStore';
import { refreshToken } from './authUtils';

// Logging for production testing
const debug = false;

export const useAppRefresh = () => {
  const appState = useRef(AppState.currentState);
  const { token, isLoggedin } = useAuthStore();

  // Triggers refresh when app is active
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        {debug && console.log("app is active, checking token")}
        if (token && isLoggedin) refreshToken();
      }
      appState.current = nextState;
    });

    return () => sub.remove();
  }, [token, isLoggedin]);

  useEffect(() => {
    if (token && isLoggedin) {
      {debug && console.log("app loaded, refreshing token now")}
      refreshToken();
    }
  }, []);
};