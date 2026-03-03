/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Learn more about Chat apps at https://developers.google.com/workspace/chat/overview

const CALLABLE_FUNCTION_URL = "https://<path-to-function>.a.run.app/";

function generateDocId(e = 10) {
  let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let t = "";
  for (let n = 0; n < e; n++) {
    t += a[Math.floor(a.length * Math.random())];
  }
  return t;
}

function generateSharedSoftware(prompt) {
  let token = ScriptApp.getIdentityToken(); // for GCP IAM (if needed)
  let response = UrlFetchApp.fetch(CALLABLE_FUNCTION_URL, {
    method: 'post',
    headers: {
      "authorization": "Bearer " + token,
      "content-type": "application/json"
    },
    payload: JSON.stringify({ prompt }),
    muteHttpExceptions: true
  })
  if (response.getResponseCode() >= 400) {
    throw new Error(response.getContentText());
  }
  let { id, title } = JSON.parse(response.getContentText());
  return { id, title };
}

/**
 * Responds to a MESSAGE event in Google Chat.
 *
 * @param {Object} event the event object from Google Chat
 */
const onMessage = chatHandler((event) => {
  // payload reference: https://developers.google.com/workspace/add-ons/concepts/event-objects#chat-payload
  let { space, message } = event.chat.messagePayload;
  // let name = space.type == "DM"
  //   ? "You"
  //   : message.sender.displayName;
  let appPrompt = message.text.replace(/@Q \(Quartermaster\)/ig, '');
  let { id, title } = generateSharedSoftware(appPrompt);
  let cleanedTitle = title.replace(/[^\w\s]+/g, '').replace(/\s+/g, ' ').trim();
  return textResponse([
    `Good news!`,
    `Your collaborative space ✨*${ellipsize(cleanedTitle, 30)}*✨`,
    `as requested by <${message.sender.name}>`,
    `is ready: `,
    `<https://link-to-your-hosted-app.com/${id}|link-to-your-hosted-app.com/${id}>`,
  ].join(' '));
});

function ellipsize(str, len = 30) {
  str = String(str);
  return str.length <= len
    ? str
    : str.substring(0, len - 3) + '...';
}

/**
 * Responds to an ADDED_TO_SPACE event in Google Chat.
 *
 * @param {Object} event the event object from Google Chat
 */
const onAddToSpace = chatHandler((event) => {
  // payload reference: https://developers.google.com/workspace/add-ons/concepts/event-objects#chat-payload
  let { space, interactionAdd } = event.chat.addedToSpacePayload;
  let message = '';
  if (space.singleUserBotDm) {
    message = "Thank you for adding me to a DM, " + event.user.displayName + "!";
  } else {
    message = [
      "Hey there! I'm *Q* (yes <https://en.wikipedia.org/wiki/Q_(James_Bond)|that one> 😉).",
      "I'm here to build collaboration tools for your team, on-the-fly.",
      "@-mention me with the tool you need and I'll send you a link in a few seconds (powered by Gemini 3 Flash)!"
    ].join(' ')
  }
  return textResponse(message);
});

/**
 * Responds to a REMOVED_FROM_SPACE event in Google Chat.
 *
 * @param {Object} event the event object from Google Chat
 */
const onRemoveFromSpace = chatHandler((event) => {
  console.info("Bot removed from ",
    (event.space.name ? event.space.name : "this chat"));
});