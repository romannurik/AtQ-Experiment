/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { ai } from "./miniapp-generator/ai";
import { generateMiniApp } from "./miniapp-generator/miniapp-generator";
import { generateTitle } from "./miniapp-generator/title-generator";
import { generateId } from "./util";

setGlobalOptions({ maxInstances: 10 });

if (!process.env.TSDOWN_FIREBASE_DATABASE_URL) {
  throw new Error("TSDOWN_FIREBASE_DATABASE_URL is not set");
}

const app = initializeApp({
  databaseURL: process.env.TSDOWN_FIREBASE_DATABASE_URL,
});
const db = getDatabase(app);

async function putSharedSoftDocument(id: string, data: any) {
  await db.ref(`sharedsoft/docs/${id}`).set(data);
}

export const generateSharedSoftDocument = onRequest(
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
      return;
    }

    const { prompt } = request.body || "";
    if (!prompt) {
      response.status(400).send("Missing `prompt` param");
      return;
    }

    let id = generateId();

    logger.info(`[${id}] Generating code asynchronously...`);
    await putSharedSoftDocument(id, {
      content: {
        prompt,
        status: "generating",
      },
    });
    let [appCode, title] = await Promise.all([
      generateMiniApp(ai, prompt),
      generateTitle(ai, prompt),
    ]);
    logger.info(`[${id}] Generated app code!`);
    await putSharedSoftDocument(id, {
      metadata: {
        title,
      },
      content: {
        prompt,
        status: "generated",
        code: appCode,
      },
    });

    response.status(200).send(
      JSON.stringify({
        prompt,
        title,
        id,
      }) + "\n"
    );
  }
);
