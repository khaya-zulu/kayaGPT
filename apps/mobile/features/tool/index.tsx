import { ToolInvocation } from "@ai-sdk/ui-utils";

import { NewWorkspaceTool } from "./new-workspace";
import { UsernameTool } from "./username";

const Components = {
  generateWorkspace: NewWorkspaceTool,
  username: UsernameTool,
};

export const Tool = ({ invocation }: { invocation: ToolInvocation }) => {
  if (invocation.state === "result") {
    const Component =
      Components[invocation.toolName as keyof typeof Components] ?? null;

    return Component ? <Component {...invocation.result} /> : null;
  }

  return null;
};
