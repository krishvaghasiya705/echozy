export const CLIENT_ID = "652abd1d8cef499b9211d6a9a3c7adaa";
export const REDIRECT_URI = "http://localhost:3000/callback";
export const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
export const RESPONSE_TYPE = "token";
export const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "playlist-read-private",
  "streaming",
].join(" ");
