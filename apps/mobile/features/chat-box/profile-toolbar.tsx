import { View } from "react-native";

import { Button } from "@/components/button";
import { Link, usePathname } from "expo-router";

import { ArrowLeft } from "phosphor-react-native";

export const ProfileToolbar = () => {
  const pathname = usePathname();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
      }}
    >
      <Link href="/" style={{ marginRight: 10 }}>
        <ArrowLeft size={14} weight="bold" />
      </Link>
      <Link href="/profile">
        <Button variant={pathname === "/profile" ? "primary" : "white"}>
          Profile
        </Button>
      </Link>
      <Link href="/profile/workspace">
        <Button variant={pathname.includes("/workspace") ? "primary" : "white"}>
          Workspace
        </Button>
      </Link>
      <Link href="/profile/bio">
        <Button variant={pathname.includes("/bio") ? "primary" : "white"}>
          Bio
        </Button>
      </Link>
    </View>
  );
};
