'use client';

import * as React from 'react';

function subscribe(callback: () => void) {
  const id = setTimeout(callback, 0);
  return () => clearTimeout(id);
}

function getServerSnapshot(): number | null {
  return null;
}

/**
 * Current time, resolved only after mount so server and client never disagree.
 * Subscribes once via useSyncExternalStore (per the recommended fix for
 * react-hooks/set-state-in-effect) rather than calling setState in an effect.
 */
export function useNow(): number | null {
  return React.useSyncExternalStore(subscribe, Date.now, getServerSnapshot);
}
