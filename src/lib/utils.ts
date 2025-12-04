export function json<T>(data: T, status: number = 200, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });
}
