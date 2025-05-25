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
import {
  useUserSettingsQuery,
  type UserSettingsQueryOutput,
  userSettingsQueryKey,
} from "@/queries/users";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

type UserContextType = {
  colorSettings: NonNullable<UserSettingsQueryOutput["colorSettings"]>;
  isLoading: boolean;
  userId?: string;
  setMs: React.Dispatch<React.SetStateAction<number | undefined>>;
  ms?: number;
};

const UserSettingsContext = createContext<UserContextType>(null as any);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isPending } = useUserSettingsQuery();
  const [ms, setMs] = useState<number>();

  const colorSettings = data?.colorSettings;

  if (isPending) {
    return null;
  }

  return (
    <UserSettingsContext.Provider
      value={{
        colorSettings: {
          "50": colorSettings?.[50] ?? zinc50,
          "100": colorSettings?.[100] ?? zinc100,
          "200": colorSettings?.[200] ?? zinc200,
          "300": colorSettings?.[300] ?? zinc300,
          "400": colorSettings?.[400] ?? zinc400,
          base: colorSettings?.["base"] ?? zinc500,
          "600": colorSettings?.[600] ?? zinc500,
          "700": colorSettings?.[700] ?? zinc600,
          "800": colorSettings?.[800] ?? zinc800,
          "900": colorSettings?.[900] ?? zinc900,
        },
        isLoading,
        userId: data?.id,
        ms,
        setMs,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);

  const ms = context.ms;

  const query = useQueryClient();

  return {
    ...context,
    workspaceUrl: `http://localhost:8787/api/workspace/${context.userId}${ms ? `?ms=${ms}` : ""}`,
    invalidate: () =>
      query.invalidateQueries({ queryKey: userSettingsQueryKey }),
    invalidateWorkspaceUrl: () => {
      context.setMs(Date.now());
    },
  };
};
