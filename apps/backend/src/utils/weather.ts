import { Env } from "./env";

export const getCurrentWeather = async (
  env: Env,
  props: {
    lat: string;
    lng: string;
  }
) => {
  const { lat, lng } = props;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${env.OPEN_WEATHER_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  const data: any = await response.json();

  return {
    temp: data.main.temp as number,
    humidity: data.main.humidity as number,
    regionName: data.name as string,
    icon: data.weather[0].icon as string,
  };
};
