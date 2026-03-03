/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

export async function generateTitle(ai: GoogleGenAI, prompt: string) {
  let result = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    config: {
      systemInstruction: `
            You are great at creating short, catchy titles for app ideas based on
            a brief description of the app's purpose. Given the description below,
            respond with a short title (4 words or less) that captures the essence
            of the app idea. Do not include any additional text or explanation.`
        .replace(/\s+/g, " ")
        .trim(),
    },
    contents: `
          Here is my prompt for an app idea:
          
          ${prompt}
          
          Now give me a short, catchy title for this app idea.`,
  });
  return result.text?.trim();
}
