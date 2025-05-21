import { ToolInvocation } from "@ai-sdk/ui-utils";

import { SocialTool } from "./social";
import { NewWorkspace } from "./new-workspace";

const Components = {
  socialLinks: SocialTool,
  generateWorkspace: NewWorkspace,
};

export const Tool = ({ invocation }: { invocation: ToolInvocation }) => {
  if (invocation.state === "result") {
    const Component =
      Components[invocation.toolName as keyof typeof Components] ?? null;

    return <Component {...invocation.result} />;
  }

  return null;
};
