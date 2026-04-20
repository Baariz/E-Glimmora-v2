'use client';

import { useSyncExternalStore } from 'react';

export interface MessageNotification {
  id: string;
  thread_id: string;
  sender_id: string;
  preview: string;
  created_at: string;
  read: boolean;
}

const MAX_ITEMS = 25;

let items: MessageNotification[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot() {
  return items;
}

function getServerSnapshot() {
  return items;
}

export const messageNotificationsStore = {
  push(n: MessageNotification) {
    if (items.some((x) => x.id === n.id)) return;
    items = [n, ...items].slice(0, MAX_ITEMS);
    emit();
  },
  markAllRead() {
    if (!items.some((x) => !x.read)) return;
    items = items.map((x) => ({ ...x, read: true }));
    emit();
  },
  markReadByThread(threadId: string) {
    let changed = false;
    items = items.map((x) => {
      if (x.thread_id === threadId && !x.read) {
        changed = true;
        return { ...x, read: true };
      }
      return x;
    });
    if (changed) emit();
  },
  clear() {
    if (items.length === 0) return;
    items = [];
    emit();
  },
  getAll() {
    return items;
  },
};

export function useMessageNotifications(): MessageNotification[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
