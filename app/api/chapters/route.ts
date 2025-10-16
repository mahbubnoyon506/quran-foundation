import { CLIENT_ID, CLIENT_SECRET } from "@/app/components/constant";
import { getToken, setToken } from "@/app/utils/globalTokenStore";
import axios, { AxiosError } from "axios";

export async function GET(): Promise<Response> {
  let accessToken = getToken();

  if (!accessToken) {
    // fetch a new one
    const tokenResponse = await axios.post<{
      access_token: string;
      expires_in: number;
    }>(
      "https://prelive-oauth2.quran.foundation/oauth2/token",
      "grant_type=client_credentials&scope=content",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = tokenResponse.data.access_token;
    setToken(accessToken, tokenResponse.data.expires_in);
  }

  try {
    const response = await axios.get(
      "https://apis-prelive.quran.foundation/content/api/v4/chapters",
      { headers: { "x-auth-token": accessToken!, "x-client-id": CLIENT_ID } }
    );

    return Response.json(response.data);
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "Error fetching chapters:",
      err.response?.data || err.message
    );
    return new Response(JSON.stringify({ error: "Failed to fetch chapters" }), {
      status: 500,
    });
  }
}
