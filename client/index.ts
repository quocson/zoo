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
            this.#ws.send(JSON.stringify({action : "$default", data}));
        } else {
            throw new Error("Websocket not connected to server");
        }
    }
}
const url = "wss://t8y3ubbm80.execute-api.ap-southeast-1.amazonaws.com/production/";

tab.waitForLeadership(() => {
    return new WsClient(url, (data) => {
        console.log("Data received from server: ", data);
        tab.send(data);
    });
});
globalThis.addEventListener("unload", () => {
    tab.close();
});

tab.addEventListener('message', event => console.log(`from leader: ${event.data}`));
export default function sendData(data: string) {
    tab.call("sendData", data);
};
