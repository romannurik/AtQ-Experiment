/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

function textResponse(text) {
  return _rawCreateMessageResponse({ text: String(text) });
}

function cardsResponse(card) {
  return _rawCreateMessageResponse({ cardsV2: [{ card }] });
}

function chatHandler(fn) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (e) {
      return textResponse(String(e.stack || '') || String(e));
    }
  }
}

function _rawCreateMessageResponse(message) {
  return {
    hostAppDataAction: {
      chatDataAction: { createMessageAction: { message } },
    },
  };
}