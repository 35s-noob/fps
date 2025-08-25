// worker.js
let clients = new Set();

export default {
  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    server.accept();
    clients.add(server);

    server.addEventListener("message", (event) => {
      for (const c of clients) {
        if (c !== server) {
          try { c.send(event.data); }
          catch { clients.delete(c); }
        }
      }
    });

    server.addEventListener("close", () => clients.delete(server));

    return new Response(null, { status: 101, webSocket: client });
  },
};
