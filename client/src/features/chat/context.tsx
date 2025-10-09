import { chatSocket } from "@/configs/socket.config";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMessageStore } from "./stores/message.store";
import type { IMessage } from "./types/message.type";
import { useRoomStore } from "./stores/room.store";

type ChatContextType = {
  onlineUsers: string[];
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string>>;
};

export const ChatContext = createContext<ChatContextType>({
  onlineUsers: [],
  setCurrentRoomId: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { setMessages, messages } = useMessageStore();
  const { rooms, setRooms, persons, setPersons } = useRoomStore();

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string>("");

  useEffect(() => {
    chatSocket.connect();

    // online
    chatSocket.on("onlineUsers", (onlineUserMap) => {
      setOnlineUsers(onlineUserMap);
    });

    // update mess read
    chatSocket.on("messages_read", ({ roomId, authId }) => {
      setMessages(
        messages.map((m) =>
          m.room === roomId ? { ...m, readBy: [m.readBy, authId] } : m
        )
      );
    });

    return () => {
      chatSocket.off("onlineUsers");
      chatSocket.off("messages_read");
      chatSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    chatSocket.on("new_message", (msg: IMessage) => {
      if (currentRoomId === msg.room) {
        const newMessage = [...messages, msg];
        setMessages(newMessage);
      }
      const newRooms = rooms.map((room) =>
        room._id === msg.room ? { ...room, lastMessage: msg } : room
      );
      const newpersons = persons.map((room) =>
        room._id === msg.room ? { ...room, lastMessage: msg } : room
      );
      setRooms(newRooms);
      setPersons(newpersons);
    });

    return () => {
      chatSocket.off("new_message");
    };
  }, [currentRoomId, rooms, persons, messages]);

  useEffect(() => {
    if (!currentRoomId) return;

    chatSocket.emit("mark_messages_read", {
      roomId: currentRoomId,
    });
  }, [currentRoomId]);

  return (
    <ChatContext.Provider value={{ onlineUsers, setCurrentRoomId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
