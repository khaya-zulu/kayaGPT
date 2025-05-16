import { View } from "react-native";

import { Pill } from "@/components/pill";
import { Link, usePathname } from "expo-router";

import { ArrowLeft } from "phosphor-react-native";

export const ProfileToolbar = () => {
  const pathname = usePathname();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 5,
        padding: 10,
        alignItems: "center",
      }}
    >
      <Link href="/" style={{ marginRight: 10 }}>
        <ArrowLeft size={14} weight="bold" />
      </Link>
      <Link href="/profile">
        <Pill variant={pathname === "/profile" ? "primary" : "white"}>
          Profile
        </Pill>
      </Link>
      <Link href="/profile/workspace">
        <Pill variant={pathname.includes("/workspace") ? "primary" : "white"}>
          Workspace
        </Pill>
      </Link>
      <Link href="/profile/bio">
        <Pill variant={pathname.includes("/bio") ? "primary" : "white"}>
          Bio
        </Pill>
      </Link>
    </View>
  );
};
