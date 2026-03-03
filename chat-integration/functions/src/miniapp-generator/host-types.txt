/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export type User = { name: string; color: string };

/**
 * Example:
 * ```ts
 * import { useSyncedState } from '$';
 *
 * function MyComponent() {
 *   const [value, setValue] = useSyncedState("value", 15);
 *   return <>The value is {value}</>;
 * }
 * ```
 */
export type useSyncedState = (
  stateKey: string,
  defaultValue: any
) => [any, (newValue: any) => void];

/**
 * Example:
 * ```ts
 * import { useLoggedInUser } from '$';
 *
 * function MyComponent() {
 *   const { name, color } = useLoggedInUser();
 *   return <>You are <span style={{ color }}>{name}</span></>;
 * }
 * ```
 */
export type useLoggedInUser = () => User;

/**
 * Calls AI, returning an async generator that yields content chunks as they arrive. Example:
 * ```ts
 * import { generateContentStream } from '$';
 * async function callAI() {
 *   let request = {
 *     contents: [
 *       {
 *         role: 'user',
 *         parts: [
 *           { text: "Hello there" }
 *         ]
 *       }
 *     ]
 *   };
 *   let result = "";
 *   for await (let chunk of generateContentStream(request)) {
 *     result += chunk;
 *     console.log("Received chunk:", chunk);
 *   }
 *   console.log("Final result:", result);
 * }
 * ```
 */
export type generateContentStream = (
  messages: Array<{ role: "user" | "model"; text: string }>
) => AsyncIterable<string>;
