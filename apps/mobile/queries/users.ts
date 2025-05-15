import { useQuery } from "@tanstack/react-query";

import { client } from "@/utils/client";

export const userBioQueryKey = [client.api.user.bio.$url().pathname];

export const useUserBioQuery = () => {
  return useQuery({
    queryKey: userBioQueryKey,
    queryFn: async () => {
      const response = await client.api.user.bio.$get();
      return response.json();
    },
  });
};
