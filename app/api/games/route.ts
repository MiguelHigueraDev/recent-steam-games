import { NextResponse } from "next/server";
import { envOrThrow } from "../../../src/utils";
import { getRecentlyPlayedGames } from "../../../src/steam";

const ALLOWED_ORIGINS = [
  envOrThrow("ALLOWED_ORIGIN"),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function withCors(response: NextResponse, request: Request) {
  const origin = request.headers.get("origin");

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Vary", "Origin");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = Number(searchParams.get("count") ?? undefined);

    const data = await getRecentlyPlayedGames(count);
    return withCors(NextResponse.json(data.response.games), request);
  } catch (error) {
    return withCors(
      NextResponse.json(
        { error: (error as Error).message ?? "Internal Server Error" },
        { status: 500 }
      ),
      request
    );
  }
}
