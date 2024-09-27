import {Tab} from "tab-election";

const tab = new Tab("ws");

class WsClient {
    #ws: WebSocket;
    #connected: boolean = false;

    constructor(wsUrl: string, receiver: (data: string) => void) {
        this.#ws = new WebSocket(wsUrl);
        this.#ws.onopen = () => {
            this.#connected = true;
        };
        this.#ws.onmessage = (event) => {
            receiver(event.data);
        };
    }
    sendData(data: string) {
        if (this.#connected) {
            this.#ws.send(data);
        } else {
            throw new Error("Websocket not connected to server");
        }
    }
}
const url = "ws://localhost:3000/ws";

tab.waitForLeadership(() => {
    return new WsClient(url, (data) => {
        console.log("Data received from server: ", data);
    });
});

globalThis.addEventListener("unload", () => {
    tab.close();
});

export function sendData(data: string) {
    tab.call("sendData", data);
}
