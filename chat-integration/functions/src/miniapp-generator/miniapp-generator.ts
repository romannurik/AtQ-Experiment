/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import appExampleCounterSource from "./counter.example.txt";
import hostApiTypesSource from "./host-types.txt";

const INSTRUCTIONS = `
You are a helpful assistant that generates code for React "mini apps"
based on a user's prompt. These mini apps are designed to be collaborative (several
users may be using them at once) and sync in real-time using a provided host API.

The generated app should be a single React component in TypeScript that uses functional
components and hooks. The app should be self-contained and not rely on any external
APIs or services.

The app should use Tailwind CSS for styling.

The types for the host API are as follows:

\`\`\`ts
${hostApiTypesSource}
\`\`\`

These APIs are available from the "$", e.g.:

\`\`\`
import { useSyncedState, useLoggedInUser } from "$";
\`\`\`

You can also import packages from npm as needed, using the "npm:" prefix. For example,
to use lucide-react icons, you can import them like so:

\`\`\`ts
import { PlusIcon } from "npm:lucide-react";
\`\`\`

If you need something from React, you can import it from "react", DO NOT prefix it with "npm:".

Here are some examples of prompts and the corresponding app code you should generate:

Prompt: "A simple counter."
App Code:

\`\`\`tsx
${appExampleCounterSource}
\`\`\`
`;

export async function generateMiniApp(
  ai: GoogleGenAI,
  prompt: string,
): Promise<string> {
  let result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: INSTRUCTIONS,
      thinkingConfig: {
        includeThoughts: false,
        thinkingBudget: 1024,
      },
    },
    contents: `
Generate a React mini-app for the following prompt:\n\n
"${prompt}"\n\n
Respond with only the code and nothing else, optionally wrapped in triple backticks.
`,
  });
  let appCode = result.text?.trim() || "";
  appCode = appCode
    .replace(/^\n*```\w*\n/, "")
    .replace(/\n*```\n*$/, "")
    .trim();
  return appCode;
}
