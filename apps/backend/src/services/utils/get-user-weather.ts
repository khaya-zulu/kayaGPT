import { getUserRegionById } from "@/queries/user";
import { Env } from "@/utils/env";
import { getCurrentWeather } from "@/utils/weather";

export const getUserWeather = async (env: Env, props: { userId: string }) => {
  const region = await getUserRegionById(env, { userId: props.userId });

  const lng = region?.lng ?? "0";
  const lat = region?.lat ?? "0";

  const weather = await getCurrentWeather(env, {
    lat,
    lng,
  });

  const temp = Math.round(weather.temp - 273.15);

  return { temp, weather };
};
