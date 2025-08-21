import { RecentlyPlayedGamesResponse } from "./types";
import { envOrThrow } from "./utils";

export const getRecentlyPlayedGames = async (
  count: number = 50
): Promise<RecentlyPlayedGamesResponse> => {
  const STEAM_API_KEY = envOrThrow("STEAM_API_KEY");
  const STEAM_ID = envOrThrow("STEAM_ID");
  const url = new URL(
    "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/"
  );

  url.searchParams.set("key", STEAM_API_KEY);
  url.searchParams.set("steamid", STEAM_ID);
  url.searchParams.set("count", count.toString());

  const response = await fetch(url.toString());
  const data = await response.json();
  return data as RecentlyPlayedGamesResponse;
};
