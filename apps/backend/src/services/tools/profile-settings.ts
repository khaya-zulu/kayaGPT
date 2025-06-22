import { createProfileSettingsTool } from "@kgpt/ai/tools";

export const profileSettingsTool = () => {
  return createProfileSettingsTool(async (inputs) => inputs);
};
