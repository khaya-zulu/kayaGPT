import { ToolInvocation } from "@ai-sdk/ui-utils";
import { SocialTool } from "./social";

const Components = {
  socialLinks: SocialTool,
};

export const Tool = ({ invocation }: { invocation: ToolInvocation }) => {
  if (invocation.state === "result") {
    const Component =
      Components[invocation.toolName as keyof typeof Components] ?? null;

    return <Component {...invocation.result} />;
  }

  return null;
};
