import { useNotification } from "@/hooks/notification";
import { bus } from "./EventBus";
class SSEClient {
  eventSource: EventSource | null = null;
  retries = 0;

  connect() {
    this.disconnect();
    this.eventSource = new EventSource(`http://localhost:3000/sse/notifications`, { withCredentials: true });
    this.eventSource.onmessage = (event) => {
      const { data } = JSON.parse(event.data);
      const store = useNotification();
      const realData = JSON.parse(data);
      const { type } = realData;
      console.log("!!!!!", type);

      switch (type) {
        case "NEW_MESSAGE":
          store.addNotification(realData.data);
          break;
        case "INIT_NOTIFICATION":
          store.initNotifications(realData.data);
          break;
      }
    };
    this.eventSource.onerror = () => {
      this.disconnect();
    };
  }

  private reconnect() {
    this.disconnect();
    if (this.retries >= 5) {
      return;
    }
    const delay = Math.min(1000 * 2 * this.retries, 30000);
    setTimeout(() => {
      this.retries++;
      this.connect();
    }, delay);
  }

  disconnect() {
    this.eventSource?.close();
    this.eventSource = null;
  }
}

export const sseClient = new SSEClient();

bus.on("connect", () => {
  sseClient.connect();
});
bus.on("logout", () => {
  sseClient.disconnect();
});
