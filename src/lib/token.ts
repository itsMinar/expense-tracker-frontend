let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

const STORAGE_ACCESS_KEY = 'accessToken';
const STORAGE_REFRESH_KEY = 'refreshToken';

const isBrowser = typeof window !== 'undefined';

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (!isBrowser) return;
  const isProd = location.protocol === 'https:';
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${isProd ? '; Secure' : ''}`;
}

function removeCookie(name: string) {
  if (!isBrowser) return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

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
      setCookie(STORAGE_ACCESS_KEY, accessToken, 15 * 60);
      setCookie(STORAGE_REFRESH_KEY, refreshToken, 7 * 24 * 60 * 60);
    }
  },

  clearTokens: () => {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    if (isBrowser) {
      localStorage.removeItem(STORAGE_ACCESS_KEY);
      localStorage.removeItem(STORAGE_REFRESH_KEY);
      removeCookie(STORAGE_ACCESS_KEY);
      removeCookie(STORAGE_REFRESH_KEY);
    }
  },
};
