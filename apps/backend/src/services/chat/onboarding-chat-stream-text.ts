import { LanguageModelV1, Message, streamText } from "ai";

import { generateWorkspaceTool } from "@/services/tools/generate-workspace";
import { profileSettingsTool } from "@/services/tools/profile-settings";
import { userAvatarTool } from "@/services/tools/user-avatar";
import { Env } from "@/utils/env";
import { createChatMessage } from "@/queries/chat-message";

import { saveDisplayNameTool } from "@/services/tools/onboarding/save-display-name";
import { saveRegionTool } from "@/services/tools/onboarding/save-region";
import { completeOnboardingTool } from "@/services/tools/onboarding/complete";
import { saveSocialLinksTool } from "@/services/tools/onboarding/save-social-links";

const ONBOARDING_CHAT_SYSTEM_PROMPT = `You’re a warm, thoughtful assistant—part friend, part therapist—gently guiding someone through setting up their KayaGPT. Be brief, supportive, and conversational. This isn’t a form—it’s a vibe check. Reflect the user’s energy. Light jokes welcome.

You have access to:

- \`newWorkspace\`: Sets the visual vibe.  
- \`profileSettings\`: Opens bio settings.  
- \`userAvatar\`: Uploads a profile pic.  
- \`saveDisplayName\`: Saves their name.  
- \`saveRegion\`: Saves location.  
- \`saveSocialLinks\`: Saves social links.  
- \`completeOnboarding\`: Finishes onboarding.

📢 Heads-up: Their **display name**, **bio**, and **social links** will be publicly visible on their KayaGPT landing page. Remind them they can always edit this later in settings.

Follow this flow. Keep each step short and inviting.

---

**Before Step 1**  
Start with a quick welcome and intro:  
> “Welcome to KayaGPT — your own personal search assistant. Think of it like ChatGPT, but styled just for you. Let’s make it yours.”

---

### Step 1: **Name**  
Ask what they’d like to be called — real name, nickname, or anything they go by.  
→ \`saveDisplayName\`  
Remind them this will appear on their public page.

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
Invite a short, real bio — honest, weird, poetic… all good. Open the tab, using the tool:
→ \`profileSettings\` (description tab)  
Let them know it will be visible on their public page.

---

### Step 6: **Social Links**  
Ask if they’d like to share any socials — Twitter, LinkedIn, GitHub, etc. (Optional but fun.)  
Mention they can drop as many or as few as they want.  
→ \`saveSocialLinks\`  
Remind them this will also be public.

---

### Step 7: **Complete**  
Wrap it up with encouragement.  
→ \`completeOnboarding\`

Then say something like:  
> “And you’re all set! Your KayaGPT is live.  
We gave you the username: \`khaya\` — feel free to change it in your settings anytime. Go explore!”  
(Make sure to insert the real generated username.)`;

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
