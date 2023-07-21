import { useState, useEffect } from "react";
import './App.css'
import { io } from "socket.io-client";

export interface IMessage {
  id: string,
  content: string
}

export default function App() {
  const [mess, setMess] = useState<IMessage[]>([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState();

  const socket = io("http://localhost:3000");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("getId", (data) => {
      setId(data);
    });

    socket.on("sendDataServer", (dataGot: {data: IMessage}) => {
      setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
    });

    return () => {
      socket.off("disconnect");
    };
  }, []);

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id,
      };
      socket.emit("sendDataClient", msg);
      setMessage("");
    }
  };

  const renderMess = mess.map((m: IMessage, index) => (
    <div
      key={index}
      className={`${m.id === id ? "your-message" : "other-people"} chat-item`}
    >
      {m.content}
    </div>
  ));

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  const onEnterPress = (e: any) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      sendMessage();
    }
  };

  return (
    <div className="box-chat">
      <div className="box-chat_message">
        {renderMess}
        <div
          style={{ float: "left", clear: "both" }}
        ></div>
      </div>

      <div className="send-box">
        <textarea
          value={message}
          onKeyDown={onEnterPress}
          onChange={handleChange}
          placeholder="Input text ..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
