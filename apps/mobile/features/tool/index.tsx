import { ToolInvocation } from "@ai-sdk/ui-utils";

import { NewWorkspaceTool } from "./new-workspace";
import { UserAvatarTool } from "./user-avatar";

const Components = {
  // todo: rename this to newWorkspace
  generateWorkspace: NewWorkspaceTool,
  userAvatar: UserAvatarTool,
};

export const Tool = ({ invocation }: { invocation: ToolInvocation }) => {
  if (invocation.state === "result") {
    const Component =
      Components[invocation.toolName as keyof typeof Components] ?? null;

    return Component ? <Component {...invocation.result} /> : null;
  }

  return null;
};
