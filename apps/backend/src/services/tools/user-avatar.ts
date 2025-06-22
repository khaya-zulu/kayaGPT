import { createUserAvatarTool } from "@kgpt/ai/tools";

export const userAvatarTool = () => {
  return createUserAvatarTool(async () => {
    return { isVisible: true };
  });
};
