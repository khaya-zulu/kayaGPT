import { ToolInvocation } from "@ai-sdk/ui-utils";

import { NewWorkspaceTool } from "./new-workspace";
import { UserAvatarTool } from "./user-avatar";
import { CompleteOnboardingTool } from "./complete-onboarding";

const Components = {
  newWorkspace: NewWorkspaceTool,
  userAvatar: UserAvatarTool,
  completeOnboarding: CompleteOnboardingTool,
};

export const Tool = ({ invocation }: { invocation: ToolInvocation }) => {
  if (invocation.state === "result") {
    const Component =
      Components[invocation.toolName as keyof typeof Components] ?? null;

    return Component ? <Component {...invocation.result} /> : null;
  }

  return null;
};
