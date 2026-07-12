let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenStorage = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },
  
  getRefreshToken: () => refreshToken,
  setRefreshToken: (token: string | null) => {
    refreshToken = token;
  },
  clear: () => {
    accessToken = null;
    refreshToken = null;
  },
};