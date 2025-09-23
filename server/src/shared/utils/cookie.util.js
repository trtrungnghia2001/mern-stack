import { defaultCookieOptions } from "#server/configs/cookie.config";

export function clearCookie(res, name_cookie, options) {
  res.clearCookie(name_cookie, {
    ...defaultCookieOptions,
    ...options,
  });
}

export function addCookie(res, name_cookie, payload, options) {
  res.cookie(name_cookie, payload, {
    ...defaultCookieOptions,
    ...options,
  });
}
