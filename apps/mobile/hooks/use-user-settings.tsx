import {
  zinc100,
  zinc200,
  zinc300,
  zinc400,
  zinc50,
  zinc500,
  zinc600,
  zinc800,
  zinc900,
} from "@/constants/theme";
import { useUserSettingsQuery, UserSettingsQueryOutput } from "@/queries/users";
import { createContext, ReactNode, useContext } from "react";

type UserContextType = {
  colorSettings: NonNullable<UserSettingsQueryOutput["colorSettings"]>;
};

const UserSettingsContext = createContext<UserContextType>(null as any);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useUserSettingsQuery();

  return (
    <UserSettingsContext.Provider
      value={{
        colorSettings: {
          "50": data?.colorSettings?.[50] ?? zinc50,
          "100": data?.colorSettings?.[100] ?? zinc100,
          "200": data?.colorSettings?.[200] ?? zinc200,
          "300": data?.colorSettings?.[300] ?? zinc300,
          "400": data?.colorSettings?.[400] ?? zinc400,
          base: data?.colorSettings?.["base"] ?? zinc500,
          "600": data?.colorSettings?.[600] ?? zinc500,
          "700": data?.colorSettings?.[700] ?? zinc600,
          "800": data?.colorSettings?.[800] ?? zinc800,
          "900": data?.colorSettings?.[900] ?? zinc900,
        },
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  return useContext(UserSettingsContext);
};
