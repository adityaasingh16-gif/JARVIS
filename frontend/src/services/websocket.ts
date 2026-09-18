export class JarvisWebSocketClient {
  private socket: WebSocket | null = null;
  private onTokenCallback?: (token: string) => void;
  private onDoneCallback?: () => void;
  private onErrorCallback?: (err: string) => void;
  private onToolCallback?: (toolData: any) => void;

  connect(
    onToken: (token: string) => void,
    onDone: () => void,
    onError: (err: string) => void,
    onTool?: (toolData: any) => void
  ) {
    this.onTokenCallback = onToken;
    this.onDoneCallback = onDone;
    this.onErrorCallback = onError;
    this.onToolCallback = onTool;

    const envWs = import.meta.env.VITE_WS_URL;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = envWs ? `${envWs.replace(/\/$/, '')}/ws/chat` : `${protocol}//${host}/ws/chat`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'token' && this.onTokenCallback) {
          this.onTokenCallback(data.token);
        } else if (data.type === 'tool_start' || data.type === 'tool_complete') {
          if (this.onToolCallback) this.onToolCallback(data);
        } else if (data.type === 'done' && this.onDoneCallback) {
          this.onDoneCallback();
        } else if (data.type === 'error' && this.onErrorCallback) {
          this.onErrorCallback(data.error);
        }
      };

      this.socket.onerror = (err) => {
        if (this.onErrorCallback) this.onErrorCallback('WebSocket Connection Error');
      };
    } catch (e) {
      if (this.onErrorCallback) this.onErrorCallback(String(e));
    }
  }

  sendMessage(message: string, history: any[] = []) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ message, history }));
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
