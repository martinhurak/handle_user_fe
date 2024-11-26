// authService.js

/*
import axios from 'axios';
axios.defaults.withCredentials = true; // Povoliť cookies pri všetkých požiadavkách
const API_URL = 'http://localhost:8000/api/token/';


export const register = async (username, password, email) => {
    const response = await axios.post('http://localhost:8000/register/', {
        username,
        password,
        email,
    });
    if (response.status === 201) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        startTokenRefreshInterval(); // Spustenie obnovovania tokenov
    }
    return response.data;
};

export const login = async (username, password) => {
    const response = await axios.post(API_URL, { username, password });
    if (response.data.access) {  // refresh token je teraz v cookies
        localStorage.setItem('access_token', response.data.access);
        startTokenRefreshInterval();
    }
    return response.data;
};

export const logout = async () => {
    try {
        await axios.post('http://localhost:8000/api/logout/', {}, {
            withCredentials: true, // Aby sa sprístupnila cookie
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        
        // Úspešné volanie logout - teraz odstráňte access token a zastavte obnovovací interval
        localStorage.removeItem('access_token');
        stopTokenRefreshInterval();
        window.location.href = '/login';  // Presmerovanie na prihlasovaciu stránku
    } catch (error) {
        console.error("Error during logout:", error);
    }
};

export const refreshToken = async () => {
    try {
        // Pošle požiadavku na obnovenie tokenu, refresh token je priamo v cookies
        const response = await axios.post(`${API_URL}refresh/`);
        localStorage.setItem('access_token', response.data.access);
        return response.data.access;
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error.message);
        return null;
    }
};

// Interval pre automatickú obnovu tokenov
let tokenRefreshInterval;

const startTokenRefreshInterval = () => {
    stopTokenRefreshInterval(); // Pre istotu vymaže starý interval
    tokenRefreshInterval = setInterval(async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/refresh/', {}, {
                withCredentials: true,
            });
            localStorage.setItem('access_token', response.data.access);
        } catch (error) {
            console.error("Token refresh failed:", error);
            // Možno chcete v tomto prípade presmerovať na prihlasovaciu stránku
        }
    }, 4 * 60 * 1000); // Každé 4 minúty
};

const stopTokenRefreshInterval = () => {
    if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
        tokenRefreshInterval = null;
    }
};

// Automaticky spusti interval, ak je používateľ prihlásený
if (localStorage.getItem('access_token')) {
    startTokenRefreshInterval();
}

export const isAuthenticated = () => {
    // Skontroluje, či je prítomný access token
    const accessToken = localStorage.getItem('access_token');
    return !!accessToken;
};

// zmena hesla 

export const changePassword = async (oldPassword, newPassword) => {
    const response = await axios.put('http://localhost:8000/api/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return response.data;
};


export const checkAuthentication = async () => {
    if (isAuthenticated()) {
      try {
        const newAccessToken = await refreshToken();
        return !!newAccessToken;
      } catch (error) {
        console.error("Token refresh error:", error);
        return false;
      }
    }
    return false;
  };
  */


  import axios from 'axios';

// Base URL pre backend API
const BASE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Nastavenie axiosu
axios.defaults.withCredentials = true;

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ======= AUTH ACTIONS =======

// Registrácia
export const register = async (username, password, email) => {
  const response = await apiClient.post('/register/', { username, password, email });
  if (response.status === 201) {
    handleTokenStorage(response.data.access, response.data.refresh);
    startTokenRefreshInterval();
  }
  
  return response.data;
};

// Prihlásenie
export const login = async (username, password) => {
  const response = await apiClient.post('/login/', { username, password });
  if (response.data.access) {
    handleTokenStorage(response.data.access);
    startTokenRefreshInterval();
  }
  return response.data;
};

// Odhlásenie
export const logout = async () => {
  try {
    await apiClient.post('/logout/', {}, { headers: { Authorization: getAuthHeader() } });
    clearTokenStorage();
    stopTokenRefreshInterval();
    window.location.href = '/login';
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// ======= TOKEN MANAGEMENT =======

// Obnova tokenu
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/token/refresh/');
    handleTokenStorage(response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Token refresh error:", error);
    clearTokenStorage();
    return null;
  }
};

// ======= HELPER FUNCTIONS =======

// Správa intervalov obnovy tokenu
let tokenRefreshInterval;

const startTokenRefreshInterval = () => {
  stopTokenRefreshInterval(); // Vymaže starý interval
  tokenRefreshInterval = setInterval(async () => {
    try {
      const newToken = await refreshToken();
      if (!newToken) {
        clearTokenStorage();
        stopTokenRefreshInterval();
      }
    } catch (error) {
      console.error("Automatic token refresh failed:", error);
    }
  }, 4 * 60 * 1000); // Každé 4 minúty
};

const stopTokenRefreshInterval = () => {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
    tokenRefreshInterval = null;
  }
};

// Správa tokenov
const handleTokenStorage = (accessToken, refreshToken = null) => {
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

const clearTokenStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

};

// ======= HELPER UTILS =======
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? `Bearer ${token}` : '';
};

// ======= ZMENA HESLA =======
export const changePassword = async (oldPassword, newPassword) => {
  const response = await apiClient.put(
    '/change-password/',
    { old_password: oldPassword, new_password: newPassword },
    { headers: { Authorization: getAuthHeader() } }
  );
  return response.data;
};

// ======= KONTROLA AUTENTIFIKÁCIE =======
export const checkAuthentication = async () => {
  if (isAuthenticated()) {
    try {
      const newAccessToken = await refreshToken();
      return !!newAccessToken;
    } catch {
      return false;
    }
  }
  return false;
};

export const setupAuthSync = (logoutCallback) => {
    window.addEventListener('storage', (event) => {
        if (event.key === 'access_token' && !event.newValue) {
            // Ak je `access_token` odstránený, vykonaj logout callback
            logoutCallback();
        }
    });
};

// ======= AUTOMATICKÁ INICIALIZÁCIA =======
if (isAuthenticated()) {
  startTokenRefreshInterval();
}
