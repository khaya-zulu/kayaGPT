import { createNewWorkspaceTool } from "@kgpt/ai/tools";

import { Env } from "@/utils/env";
import { openaiClient } from "@/utils/openai";

import { getReferenceImage } from "../utils/get-reference-image";
import { createId } from "@paralleldrive/cuid2";

export const generateWorkspaceTool = (env: Env, props: { userId: string }) => {
  return createNewWorkspaceTool(async ({ prompt }) => {
    const client = openaiClient(env);

    const referenceImage = await getReferenceImage();

    const response = await client.images.edit({
      model: "gpt-image-1",
      image: [referenceImage],
      prompt:
        `You are an image generator for themed digital workspaces. Output photorealistic or 3D-rendered images with no text or branding. Follow these key guidelines:

- **Theme & Colors**: Support color schemes such as pink, black, white, wood, sky blue, orange, or custom blends. Themes should convey mood or personality (e.g., soft pink for calm, black for sleek). **Do not imply gender** in design elements.

- **Environment**: Place workspaces in a variety of immersive settings—indoors or outdoors. These could be minimalist interiors, futuristic sci-fi spaces (like spacecraft), forest surroundings, cyberpunk environments, or cozy studios. Be imaginative and atmospheric.

- **Style & Materials**: Use materials appropriate to the setting—wood, metal, glass, fabric, neon, etc.—and keep the space clean, cohesive, and visually functional.

- **Workspace Integration**: The desk and furniture **must match the environment**. For example:
  - In a forest, the desk could be made from tree stumps or natural wood.
  - In a spaceship, the desk might use sleek metal, illuminated edges, or modular tech designs.
  - In a cyberpunk room, it might feature glowing panels or industrial hardware.

- **Add/Remove Items**: **Remove laptops and monitors.** Include or exclude other elements such as chairs, decor, or shelving based on user instruction.

- **Lighting**: Lighting should reflect the desired tone—natural light for grounded or serene scenes, ambient or synthetic light for futuristic or conceptual spaces.

- **Camera Angle (Must)**: The scene **must be rendered from a head-on, centered viewpoint**—as if the viewer is directly in front of the desk at standing height. No diagonal or side angles.

- **Output**: Image-only. No visible text, branding, or watermarks.` +
        "Here is the users instructions:" +
        "\n\n" +
        prompt,
    });

    const base64 = response.data?.[0]?.b64_json;

    if (base64) {
      const imageBytes = Buffer.from(base64, "base64");
      const workspaceKey = `temp/${props.userId}/${createId()}`;

      await env.R2_WORKSPACE.put(workspaceKey, imageBytes, {
        httpMetadata: {
          contentType: "image/png",
        },
      });

      return { workspaceKey, prompt };
    }

    return { prompt };
  });
};
