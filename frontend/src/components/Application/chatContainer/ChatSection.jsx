import React, { useEffect, useContext, useState, useRef } from "react";
import { getMessageFromDb } from "../../../backendconnection/backendapi.js";
import authContext from "../../../context/authContext.js";
import MessageChat from "./MessageChat.jsx";
import { formatDate, formatDateKey } from "./timeConversion.js";

const ChatSection = () => {
  const { user, selectedContact, socket } = useContext(authContext);

  const [messages, setMessages] = useState([]);
  const messageDivScrollerRef = useRef();

  useEffect(() => {
    const messaging = async () => {
      try {
        const { data } = await getMessageFromDb(
          user.email,
          selectedContact.email
        );
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (user.email && selectedContact.email) {
      messaging();
    }
  }, [selectedContact, user.email]);

  useEffect(() => {
    const handleLiveMessage = (liveMessage) => {
      setMessages((prev) => [...prev, liveMessage]);
    };

    socket.on("sendLiveMessage", handleLiveMessage);

    return () => {
      socket.off("sendLiveMessage", handleLiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (messageDivScrollerRef.current) {
      messageDivScrollerRef.current.scrollTop =
        messageDivScrollerRef.current.scrollHeight;
    }
  }, [messages]);

  const renderMessages = () => {
    let lastDate = null;

    return messages.map((message, index) => {
      const messageDate = formatDateKey(message.timestamp);
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center italic text-grey-100 my-2 flex justify-center items-center ">
              <div className="bg-slate-50 w-fit px-16 py-2 rounded-full shadow-md border-4 border-slate-100 font-semibold text-xs">
              {formatDate(message.createdAt)}
              </div>
            </div>
          )}
          <div className="">
            <MessageChat message={message} />
          </div>
        </div>
      );
    });
  };

  return (
    <div
      className="flex-1 bg-slate-100 overflow-y-auto py-4"
      ref={messageDivScrollerRef}
    >
      <div className="messages">{renderMessages()}</div>
    </div>
  );
};

export default ChatSection;
