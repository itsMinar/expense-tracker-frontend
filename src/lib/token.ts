let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

const STORAGE_ACCESS_KEY = 'accessToken';
const STORAGE_REFRESH_KEY = 'refreshToken';

const isBrowser = typeof window !== 'undefined';

export const tokenStore = {
  getAccessToken: (): string | null => {
    if (memoryAccessToken) return memoryAccessToken;
    if (isBrowser) return localStorage.getItem(STORAGE_ACCESS_KEY);
    return null;
  },

  getRefreshToken: (): string | null => {
    if (memoryRefreshToken) return memoryRefreshToken;
    if (isBrowser) return localStorage.getItem(STORAGE_REFRESH_KEY);
    return null;
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    memoryAccessToken = accessToken;
    memoryRefreshToken = refreshToken;
    if (isBrowser) {
      localStorage.setItem(STORAGE_ACCESS_KEY, accessToken);
      localStorage.setItem(STORAGE_REFRESH_KEY, refreshToken);
    }
  },

  clearTokens: () => {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    if (isBrowser) {
      localStorage.removeItem(STORAGE_ACCESS_KEY);
      localStorage.removeItem(STORAGE_REFRESH_KEY);
    }
  },
};
