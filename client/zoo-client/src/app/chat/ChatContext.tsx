'use client'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import tabs from "../../service/comm";
type chatContextType = {
    chatlog: string[];
    sendData: (s: string) => void;
};
const defaultValues: chatContextType = {
  chatlog: [],
  sendData: () => {},
};
const ChatContext = createContext(defaultValues);

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {

    const chatRef = useRef<any>(null);    
    useEffect(() =>{ chatRef.current =[] }, []);
    const [chatlog, setChat] = useState([]);
    const [added, setAdded] = useState<boolean>(false);
    const {sendData, addListener} = tabs();
    useEffect(() => {

      if(!added) 
        {
            addListener((msg) =>{
                chatRef.current = [...chatRef.current, msg];
                setChat(chatRef.current)
            });
            setAdded(true);
        }
    },[])
  return (
    <ChatContext.Provider value={{chatlog, sendData}}>
      {children}
    </ChatContext.Provider>
  );
};
