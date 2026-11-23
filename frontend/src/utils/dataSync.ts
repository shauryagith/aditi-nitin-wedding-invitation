/**
 * Real-Time Wedding Data Synchronization Manager
 * 
 * Ensures instant synchronization across the Wedding Website whenever changes
 * are made in the Admin Dashboard:
 * 1. Cross-Tab / Cross-Window BroadcastChannel (sub-millisecond instant sync)
 * 2. LocalStorage StorageEvent fallback for multi-tab updates
 * 3. In-tab custom DOM event bus for single-page navigations
 * 4. Window focus & document visibilitychange automatic re-sync
 * 5. Background heartbeat polling for multi-device live sync
 */

type SyncCallback = (entity?: string) => void;

class WeddingSyncManager {
  private channel: BroadcastChannel | null = null;
  private subscribers = new Set<SyncCallback>();
  private lastKnownUpdated = 0;
  private pollTimer: any = null;
  private isPolling = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // 1. Initialize BroadcastChannel for instant cross-tab sync
    try {
      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('aditi_nitin_wedding_sync');
        this.channel.onmessage = (event) => {
          this.emitLocal(event.data?.entity || 'all');
        };
      }
    } catch {
      this.channel = null;
    }

    // 2. Storage event fallback for cross-tab sync
    window.addEventListener('storage', (e) => {
      if (e.key === 'aditi_nitin_data_sync_ts' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          this.emitLocal(parsed.entity || 'all');
        } catch {
          this.emitLocal('all');
        }
      }
    });

    // 3. In-tab custom event listener
    window.addEventListener('aditi_nitin_in_tab_sync', ((e: CustomEvent) => {
      this.emitLocal(e.detail?.entity || 'all');
    }) as EventListener);

    // 4. Window Focus & Document Visibility Listeners
    window.addEventListener('focus', () => {
      this.emitLocal('all');
      this.checkServerSync();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.emitLocal('all');
        this.checkServerSync();
      }
    });

    // 5. Start background server heartbeat
    this.startHeartbeat();
  }

  /**
   * Broadcast an update across all tabs, windows, and in-tab subscribers
   */
  public notifyUpdate(entity: string = 'all') {
    const timestamp = Date.now();
    this.lastKnownUpdated = timestamp;

    // A. BroadcastChannel
    try {
      this.channel?.postMessage({ entity, timestamp });
    } catch {
      // Ignored
    }

    // B. LocalStorage fallback for other tabs
    try {
      localStorage.setItem(
        'aditi_nitin_data_sync_ts',
        JSON.stringify({ entity, timestamp })
      );
    } catch {
      // Ignored
    }

    // C. In-tab custom event
    try {
      window.dispatchEvent(
        new CustomEvent('aditi_nitin_in_tab_sync', { detail: { entity, timestamp } })
      );
    } catch {
      // Ignored
    }

    // D. Direct invocation for immediate local reaction
    this.emitLocal(entity);
  }

  /**
   * Subscribe to wedding data changes
   * @returns Unsubscribe function
   */
  public subscribe(callback: SyncCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Directly notify all local subscribers
   */
  private emitLocal(entity: string) {
    this.subscribers.forEach((cb) => {
      try {
        cb(entity);
      } catch (err) {
        console.warn('[Sync Error]', err);
      }
    });
  }

  /**
   * Check server /api/sync-status to catch updates from other devices/admins
   */
  public async checkServerSync() {
    if (typeof window === 'undefined' || this.isPolling) return;
    this.isPolling = true;

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
      const res = await fetch(`${apiBase}/sync-status`, {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.lastUpdated) {
          if (this.lastKnownUpdated === 0) {
            this.lastKnownUpdated = json.lastUpdated;
          } else if (json.lastUpdated > this.lastKnownUpdated) {
            this.lastKnownUpdated = json.lastUpdated;
            this.emitLocal('all');
          }
        }
      }
    } catch {
      // Network drop or offline; ignore gracefully
    } finally {
      this.isPolling = false;
    }
  }

  /**
   * Periodic gentle heartbeat to keep clients in sync without high CPU/network
   */
  private startHeartbeat() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    // Poll every 6 seconds when document is visible
    this.pollTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.checkServerSync();
      }
    }, 6000);
  }
}

export const weddingSyncManager = new WeddingSyncManager();
