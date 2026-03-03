/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { MinusIcon, PlusIcon } from "npm:lucide-react";
import { useSyncedState, useLoggedInUser } from "$";

export default function App() {
  const [count, setCount] = useSyncedState("counter", 0);
  const { name, color } = useLoggedInUser();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div>
        Hello, <span style={{ color }}>{name}</span>
      </div>
      <div className="text-8xl text-bold text-green-600">{count}</div>
      <div className="flex gap-1">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
          onClick={() => setCount(count - 1)}
        >
          <MinusIcon />
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
          onClick={() => setCount(count + 1)}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
