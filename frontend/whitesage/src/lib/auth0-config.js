// lib/auth0-config.js
export const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
  scope: "openid profile email",
  redirectUri:
    process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || "http://localhost:3000",
};
