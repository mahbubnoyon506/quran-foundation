// utils/token.ts
export async function getAccessToken(): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/token`, {
    method: "POST",
  });
  const data = await res.json();
  return data.access_token;
}
