import { chatSocket } from "@/configs/socket.config";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMessageStore } from "./stores/message.store";
import type { IMessage } from "./types/message.type";
import { useRoomStore } from "./stores/room.store";
import type { IRoom } from "./types/room.type";
import { useAuthStore } from "../auth/stores/auth.store";

type ChatContextType = {
  onlineUsers: string[];
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string>>;
};

export const ChatContext = createContext<ChatContextType>({
  onlineUsers: [],
  setCurrentRoomId: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
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

    return () => {
      chatSocket.off("onlineUsers");
      chatSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    chatSocket.on("room_created", (room: IRoom) => {
      chatSocket.emit("join_room", room._id);
      let newRooms = [];
      if (room.type === "group") {
        newRooms = [room, ...rooms];
        setRooms(newRooms);
      }
      if (room.type === "direct") {
        const otherUser = room.members.find(
          (m) => m.user._id !== user?._id
        )?.user;
        const convertRoom = {
          ...room,
          ...otherUser,
          _id: room._id,
          userId: otherUser?._id,
        };
        newRooms = [convertRoom, ...persons];
        setPersons(newRooms);
      }
    });

    chatSocket.on("member_added", ({ room }) => {
      const newRooms = [room, ...rooms];
      setRooms(newRooms);
      chatSocket.emit("join_room", room._id);
    });

    chatSocket.on("member_removed", ({ roomId }) => {
      chatSocket.emit("leave_room", roomId);
      const newRoom = rooms.filter((r) => r._id !== roomId);
      setRooms(newRoom);
    });

    return () => {
      chatSocket.off("room_created");
      chatSocket.off("member_added");
      chatSocket.off("member_removed");
    };
  }, [currentRoomId, rooms, persons, messages]);

  useEffect(() => {
    chatSocket.on("new_message", (msg: IMessage) => {
      if (currentRoomId === msg.room) {
        const newMessage = [...messages, msg];
        setMessages(newMessage);
      }

      console.log({ msg });

      const newRooms = rooms.map((room) =>
        room._id === msg.room ? { ...room, lastMessage: msg } : room
      );
      const newPersons = persons.map((room) =>
        room._id === msg.room ? { ...room, lastMessage: msg } : room
      );
      setRooms(newRooms);
      setPersons(newPersons);
    });

    return () => {
      chatSocket.off("new_message");
    };
  }, [currentRoomId, messages, rooms, persons]);

  useEffect(() => {
    // update mess read
    chatSocket.on("messages_read", ({ roomId, authId }) => {
      setMessages(
        messages.map((m) =>
          m.room === roomId ? { ...m, readBy: [m.readBy, authId] } : m
        )
      );
    });
    return () => {
      chatSocket.off("messages_read");
    };
  }, [messages]);

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
