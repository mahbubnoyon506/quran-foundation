import {
  AUTH_ENDPOINT,
  CLIENT_ID,
  CLIENT_SECRET,
} from "@/app/components/constant";
import { setToken, getToken } from "@/app/utils/globalTokenStore";
import axios, { AxiosError } from "axios";

export async function POST(): Promise<Response> {
  //Check cached token
  const cached = getToken();
  if (cached) {
    return Response.json({ access_token: cached, cached: true });
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  try {
    // Request new token
    const res = await axios.post(
      `${AUTH_ENDPOINT}`,
      "grant_type=client_credentials&scope=content",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in } = res.data;

    // Cache it globally
    setToken(access_token, expires_in);

    return Response.json({ access_token, cached: false });
  } catch (error) {
    const err = error as AxiosError;
    console.error("Token fetch error:", err.response?.data || err.message);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch token",
        details: err.response?.data || err.message,
      }),
      { status: 500 }
    );
  }
}
