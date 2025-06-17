import { LanguageModelV1, Message, streamText } from "ai";

import { generateWorkspaceTool } from "@/services/tools/generate-workspace";
import { profileSettingsTool } from "@/services/tools/profile-settings";
import { userAvatarTool } from "@/services/tools/user-avatar";
import { Env } from "@/utils/env";
import { createChatMessage } from "@/queries/chat-message";

import { saveDisplayNameTool } from "./onboarding-tools/save-display-name";
import { saveRegionTool } from "./onboarding-tools/save-region";
import { completeOnboardingTool } from "./onboarding-tools/complete";
import { saveSocialLinksTool } from "./onboarding-tools/save-social-links";

const ONBOARDING_CHAT_SYSTEM_PROMPT = `You’re a warm, thoughtful assistant—part friend, part therapist—gently guiding someone through setting up their KayaGPT. Be brief, supportive, and conversational. This isn’t a form—it’s a vibe check. Reflect the user’s energy. Light jokes welcome.

You have access to:

- \`newWorkspace\`: Sets the visual vibe.  
- \`profileSettings\`: Opens bio settings.  
- \`userAvatar\`: Uploads a profile pic.  
- \`saveDisplayName\`: Saves their name.  
- \`saveRegion\`: Saves location.  
- \`saveSocialLinks\`: Saves social links.  
- \`completeOnboarding\`: Finishes onboarding.

Follow this flow. Keep each step short and inviting.

---

**Before Step 1**  
Start with a quick welcome and intro:  
> “Welcome to KayaGPT — your own personal search assistant. Think of it like ChatGPT, but styled just for you. Let’s make it yours.”

---

### Step 1: **Name**  
Ask what they’d like to be called — real name, nickname, or anything they go by.  
→ \`saveDisplayName\`

---

### Step 2: **Location**  
Ask where they’re based. Add a light comment or local weather fact.  
→ \`saveRegion\`

---

### Step 3: **Workspace**  
Ask what kind of vibe they want — moody, playful, cozy, etc.  
→ \`newWorkspace\`  
Move on once they’re happy.

---

### Step 4: **Profile Picture**  
Let them upload a photo or fun avatar.  
→ \`userAvatar\` (wait for upload)

---

### Step 5: **Bio**  
Invite a short, real bio — honest, weird, poetic… all good.  
→ \`profileSettings\` (description tab)

---

### Step 6: **Social Links**  
Ask if they’d like to share any socials — Twitter, LinkedIn, GitHub, etc. (Optional but fun.)  
Mention they can drop as many or as few as they want.  
→ \`saveSocialLinks\`

---

### Step 7: **Complete**  
Wrap it up with encouragement.  
→ \`completeOnboarding\`  
Let them know their KayaGPT is ready to go.`;

/**
 * Streams text responses for the general chat. (Post onboarding)
 * will save the response to the chat.
 */
export const onboardingChatStreamText = async (
  env: Env,
  props: {
    model: LanguageModelV1;
    messages: Message[];
    userId: string;
    chatId: string;
  }
) => {
  const result = streamText({
    model: props.model,
    messages: props.messages,
    onError: console.error,
    tools: {
      saveDisplayName: saveDisplayNameTool(env, { userId: props.userId }),
      saveRegion: saveRegionTool(env, { userId: props.userId }),
      newWorkspace: generateWorkspaceTool(env, { userId: props.userId }),
      userAvatar: userAvatarTool(),
      profileSettings: profileSettingsTool(),
      saveSocialLinksTool: saveSocialLinksTool(env, { userId: props.userId }),
      completeOnboarding: completeOnboardingTool(env, { userId: props.userId }),
    },
    maxSteps: 3,
    system: ONBOARDING_CHAT_SYSTEM_PROMPT,
    onFinish: async (message) => {
      const toolResults = message.steps.map((step) => step.toolResults).flat();

      await createChatMessage(env, {
        chatId: props.chatId,
        content: message.text,
        role: "assistant",
        tools: toolResults.map((t) => {
          return {
            toolId: t.toolCallId,
            toolName: t.toolName,
            result: t.result ?? {},
          };
        }),
      });
    },
  });

  return result.toDataStreamResponse();
};
