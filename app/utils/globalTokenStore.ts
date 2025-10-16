// utils/globalTokenStore.ts
type TokenData = {
  accessToken: string | null;
  expiresAt: number | null;
};

const globalForToken = globalThis as unknown as { tokenStore?: TokenData };

export const tokenStore =
  globalForToken.tokenStore ??
  (globalForToken.tokenStore = {
    accessToken: null,
    expiresAt: null,
  });

export function setToken(token: string, expiresInSeconds: number) {
  tokenStore.accessToken = token;
  tokenStore.expiresAt = Date.now() + expiresInSeconds * 1000;
}

export function getToken(): string | null {
  if (tokenStore.expiresAt && Date.now() > tokenStore.expiresAt) {
    tokenStore.accessToken = null;
  }
  return tokenStore.accessToken;
}

// // utils/globalTokenStore.ts
// type TokenData = {
//   accessToken: string | null;
//   expiresAt: number | null;
// };

// const globalForToken = globalThis as unknown as { tokenStore?: TokenData };

// export const tokenStore =
//   globalForToken.tokenStore ??
//   (globalForToken.tokenStore = {
//     accessToken: null,
//     expiresAt: null,
//   });

// export function setToken(token: string, expiresInSeconds: number) {
//   tokenStore.accessToken = token;
//   tokenStore.expiresAt = Date.now() + expiresInSeconds * 1000;
// }

// export function getToken() {
//   if (tokenStore.expiresAt && Date.now() > tokenStore.expiresAt) {
//     // expired
//     tokenStore.accessToken = null;
//   }
//   return tokenStore.accessToken;
// }
