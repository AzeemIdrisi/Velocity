export function extractJWT(headers) {
  // Extract the "Set-Cookie" header value, which is an array of cookie strings
  const cookies = headers["set-cookie"];

  // Find the cookie that starts with "jwt="
  const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));

  if (jwtCookie) {
    // Split the cookie string at the '=' character to get the JWT part
    const token = jwtCookie.split(";")[0].split("=")[1];
    console.log("Extracted Token: ", token);
    return token;
  } else {
    console.error("JWT not found in cookies");
    return null;
  }
}
