import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();


app.get(
  '/static/*',
  
  serveStatic({
    
    root: `./dist/client`,
    
    rewriteRequestPath: (path) => {
      return path.replace('/static', '')
    },

    onNotFound: (path, c) => {
      console.log('not found', path, c.req.url)
    }
  }));


app.get("/hello", (c) => c.text("Hello World!"));

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.get(
    "/ws",
    upgradeWebSocket((c) => ({
        onOpen: (ws) => {
            console.log("Connection opened");
        },

        onMessage(event, ws) {
            console.log(`Message from client: ${event.data}`);
            ws.send(`Hello from server!, you said: ${event.data}`);
        },
        onClose: () => {
            console.log("Connection closed");
        },
    })),
);

const server = serve(app);
injectWebSocket(server);