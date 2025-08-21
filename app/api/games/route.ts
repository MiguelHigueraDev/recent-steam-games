import { NextResponse } from "next/server";
import { getRecentlyPlayedGames } from "../../../src/steam";

export const dynamic = "force-dynamic";

const ALLOWED_ORIGIN = "https://miguelhiguera.dev";

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  response.headers.set("Vary", "Origin");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  return withCors(
    new NextResponse(null, {
      status: 204,
    })
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countParam = searchParams.get("count");
    const count = countParam ? Number(countParam) : undefined;

    const data = await getRecentlyPlayedGames(count);
    return withCors(NextResponse.json(data.response.games));
  } catch (error) {
    return withCors(
      NextResponse.json(
        { error: (error as Error).message ?? "Internal Server Error" },
        { status: 500 }
      )
    );
  }
}
