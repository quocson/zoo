'use client'

import { useState } from "react";
import { useChat } from "./ChatContext";
const ChatComponent = () => {
    const {chatlog, sendData} = useChat();
    const [msgIn, setMsgIn] = useState<string>("");
    return (
        <div className="chatlog-container">
            
            { chatlog ?
                chatlog.map((item, index) => (
                    <p key={index}>{item}</p> 
                )) : <br/>                
            }
            
            <input name="message" className="text-gray-900" placeholder="input your message here" value={msgIn} onChange={e => setMsgIn(e.target.value)}></input>
            <button id="sendButton" onClick={() => sendData(msgIn)}>send</button>
        </div>
    );
};

export default ChatComponent;