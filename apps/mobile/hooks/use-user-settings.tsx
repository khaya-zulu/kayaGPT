import { useUserSettingsQuery, UserSettingsQueryOutput } from "@/queries/users";
import { createContext, ReactNode, useContext } from "react";

const UserSettingsContext = createContext<{
  settings: UserSettingsQueryOutput | undefined;
}>(null as any);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useUserSettingsQuery();

  return (
    <UserSettingsContext.Provider value={{ settings: data }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  return useContext(UserSettingsContext);
};
