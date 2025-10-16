// @ts-nocheck

import { CLIENT_ID } from "@/app/components/constant";
import { getToken, setToken } from "@/app/utils/globalTokenStore";
import axios from "axios";

export async function GET(): Promise<Response> {
  let accessToken = getToken();

  if (!accessToken) {
    // fetch a new one
    const tokenResponse = await axios.post(
      "https://prelive-oauth2.quran.foundation/oauth2/token",
      "grant_type=client_credentials&scope=content",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${process.env.CLIENT_SECRET}`
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
  } catch (error: unknown) {
    console.error(
      "Error fetching chapters:",
      error.response?.data || error.message
    );
    return new Response(JSON.stringify({ error: "Failed to fetch chapters" }), {
      status: 500,
    });
  }
}
