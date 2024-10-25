'use client'
import { Tab } from "tab-election";
let t = { sendData: (d: string) => { }, addListener: (handler: (data: string) => any) => { }, init: false };
export default function () {
    if (typeof window === 'undefined' || typeof navigator === 'undefined')
        return t = { ...t, init: true };
    if (t.init) return t;    
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
                this.#ws.send(JSON.stringify({ action: "$default", data }));
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
            if(tab.isLeader)
                onMsg(data);
        });
    });
    globalThis.addEventListener("unload", () => {
        tab.close();
    });
    const handlers: ((data: string) => any)[] = [];
    const onMsg = (msg: string) => {
        handlers.forEach(h => h(msg));
    }
    tab.addEventListener('message', event => {
        console.log("Data received from leader: ", event.data);
        onMsg(event.data)
    });
    const addListener = (handler: (data: string) => any) => handlers.push(handler);

    const sendData = (data: string) => {
        tab.call("sendData", data);
    };
    return t = { sendData, addListener, init: true };
}
