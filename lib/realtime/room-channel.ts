import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface RoomChannelHandler {
  send: (type: string, payload?: unknown) => Promise<void>;
  on: (type: string, callback: (payload: any) => void) => void;
  close: () => void;
}

export function createRoomChannel(roomPin: string): RoomChannelHandler {
  const normalizedPin = roomPin.trim().toUpperCase();

  // 1. SUPABASE REALTIME CLOUD (Cross-device, worldwide WebSocket synchronization)
  const client = supabase;
  if (isSupabaseConfigured && client) {
    const channelId = `arcade_room_${normalizedPin}`;
    const channel = client.channel(channelId, {
      config: {
        broadcast: {
          self: false,
        },
      },
    });

    const listeners: Map<string, Array<(payload: any) => void>> = new Map();
    let isSubscribed = false;
    const pendingQueue: Array<{ type: string; payload: unknown }> = [];

    const flushQueue = async () => {
      while (pendingQueue.length > 0) {
        const item = pendingQueue.shift();
        if (item) {
          try {
            await channel.send({
              type: 'broadcast',
              event: item.type,
              payload: item.payload,
            });
          } catch (e) {
            console.warn('[RoomChannel] send error from queue', e);
          }
        }
      }
    };

    channel
      .on('broadcast', { event: '*' }, (message: { event: string; payload: unknown }) => {
        const eventType = message.event;
        const payload = message.payload;
        const cbs = listeners.get(eventType);
        if (cbs) {
          cbs.forEach((cb) => cb(payload));
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          isSubscribed = true;
          flushQueue();
        }
      });

    return {
      send: async (type: string, payload: unknown = {}) => {
        if (!isSubscribed) {
          pendingQueue.push({ type, payload });
          return;
        }
        try {
          await channel.send({
            type: 'broadcast',
            event: type,
            payload,
          });
        } catch (e) {
          console.warn('[RoomChannel] send error', e);
        }
      },
      on: (type: string, callback: (payload: any) => void) => {
        if (!listeners.has(type)) {
          listeners.set(type, []);
        }
        listeners.get(type)!.push(callback);
      },
      close: () => {
        isSubscribed = false;
        try {
          client.removeChannel(channel);
        } catch (e) {
          console.warn('[RoomChannel] removeChannel error', e);
        }
      },
    };
  }

  // 2. BROWSER BROADCAST CHANNEL (Fallback for local tabs on same machine)
  if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
    const bc = new BroadcastChannel(`arcade_room_${normalizedPin}`);
    const listeners: Map<string, Array<(payload: any) => void>> = new Map();

    bc.onmessage = (event) => {
      const data = event.data;
      if (data && data.type) {
        const cbs = listeners.get(data.type);
        if (cbs) {
          cbs.forEach((cb) => cb(data.payload));
        }
      }
    };

    return {
      send: async (type: string, payload: unknown = {}) => {
        bc.postMessage({ type, payload });
      },
      on: (type: string, callback: (payload: any) => void) => {
        if (!listeners.has(type)) {
          listeners.set(type, []);
        }
        listeners.get(type)!.push(callback);
      },
      close: () => {
        bc.close();
      },
    };
  }

  // Stub for SSR
  return {
    send: async () => {},
    on: () => {},
    close: () => {},
  };
}
