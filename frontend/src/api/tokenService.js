/**
 * In-memory access token holder.
 *
 * The JWT access token is intentionally kept in memory only (never in
 * localStorage/sessionStorage) to reduce XSS exposure. The refresh token
 * lives in an httpOnly cookie set by the backend, so a page reload can
 * silently re-establish a session via the /auth/refresh-token endpoint.
 */
let accessToken = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};
