import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Chat from "./Chat"; 
import { v4 as uuidv4 } from "uuid"; 

function ChatContainer({ currentChat }) {
  const [messages, setMessages] = useState([]); 
  const scrollRefs = useRef([]); 

 
  const handleSendMsg = async (msg) => {

  };

  return (

    currentChat && (
      <Container>
        <div className="chat-header">
          <div className="user-details">
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={uuidv4()} 
              ref={(element) => (scrollRefs.current[index] = element)}
            >
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"}`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Chat handleSendMsg={handleSendMsg} /> 
      </Container>
    )
  );
}

const Container = styled.div`
 
`;

export default ChatContainer;
