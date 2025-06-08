import { LanguageModelV1, Message, streamText } from "ai";

import { generateWorkspaceTool } from "@/services/tools/generate-workspace";
import { profileSettingsTool } from "@/services/tools/profile-settings";
import { userAvatarTool } from "@/services/tools/user-avatar";
import { Env } from "@/utils/env";
import { createChatMessage } from "@/queries/chat-message";

import { saveDisplayNameTool } from "./onboarding-tools/save-display-name";
import { saveRegionTool } from "./onboarding-tools/save-region";
import { completeOnboardingTool } from "./onboarding-tools/complete";

import { createOpenAIModel } from "@/utils/models";

const ONBOARDING_CHAT_SYSTEM_PROMPT = `You’re a warm, thoughtful assistant—part friend, part therapist—gently guiding someone through creating their personal chatbot. This is a moment of self-discovery, not a form. Be conversational, supportive, curious. Reflect their energy. Light jokes and personal insights are welcome.

You have access to these tools:

- \`newWorkspace\`: Generates a visual background based on their vibe.
- \`profileSettings\`: Opens profile settings to add a short bio.
- \`userAvatar\`: Opens upload for their profile pic.
- \`saveDisplayName\`: Saves display name and username.
- \`saveRegion\`: Saves location.
- \`saveSocialLinks\`: Saves their social links.
- \`completeOnboarding\`: Marks onboarding as complete.

Each step should feel like a gentle invitation, not a task. Follow this order:

---

### Step 1: **Name**  
Start with a warm welcome. Ask what they’d like to be called—it can be playful, serious, or made up.  
→ Save it with \`saveDisplayName\`.

---

### Step 2: **Location**  
Ask where they’re based. Respond with a light or thoughtful comment.  
→ Save it with \`saveRegion\`.

---

### Step 3: **Workspace**  
Ask them to imagine their ideal workspace—inspired by their mood, hobbies, or hometown.  
→ Use \`newWorkspace\`.  
When they’re happy with it, move to the next step.

---

### Step 4: **Profile Picture**  
Let them upload a profile pic—faces (or fun avatars) bring the space to life.  
→ Use \`userAvatar\` and wait for confirmation.

---

### Step 5: **Bio**  
Invite them to write a short, true bio. It can be honest, weird, or poetic.  
→ Open \`profileSettings\` with the \`description\` tab.

---

### Step 6: **Complete**  
Wrap it up with encouragement.  
→ Call \`completeOnboarding\`. Let them know their chatbot is ready and it’s time to explore.`;

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
    model: await createOpenAIModel(env, ["gpt-4.1-2025-04-14"]),
    messages: props.messages,
    onError: console.error,
    tools: {
      saveDisplayName: saveDisplayNameTool(env, { userId: props.userId }),
      saveRegion: saveRegionTool(env, { userId: props.userId }),
      newWorkspace: generateWorkspaceTool(env, { userId: props.userId }),
      userAvatar: userAvatarTool(),
      profileSettings: profileSettingsTool(),
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
