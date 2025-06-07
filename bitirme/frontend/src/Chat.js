import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import { IoMdSend } from "react-icons/io";
import { useShopContext } from "./Context/ShopContext";
import { useNavigate } from 'react-router-dom';
const socket = io("http://localhost:3000");

const ChatWithDashboard = () => {
  const sellerUsername = localStorage.getItem("sellerUsername");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [senders, setSenders] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [newMessageNotification, setNewMessageNotification] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user-info"));
const username = user?.username;
const email = user?.email;

  const savedUser = JSON.parse(localStorage.getItem("user-info"));

  const { productID } = useShopContext();
  useEffect(() => {
    if (!user) {
      alert("Please log in to use the chat.");
      navigate('/login');
    }
  }, []);
  useEffect(() => {
    if (sellerUsername) {
      setSelectedUser(sellerUsername);
      const room = [username, sellerUsername].sort().join("-");
      setRoomId(room);
      socket.emit("join-room", room);
    }
  }, [sellerUsername, username]);


  useEffect(() => {
    const allSellers = new Set();

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("newBooks_")) {
        try {
          const bookData = JSON.parse(localStorage.getItem(key));
          if (!Array.isArray(bookData)) return;

          bookData.forEach((book) => {
            const seller = typeof book.sellerUsername === "object"
              ? book.sellerUsername.username
              : book.sellerUsername;
            if (seller && seller !== username) {
              allSellers.add(seller);
            }
          });
        } catch (err) {
          console.error("Veri hatası:", key, err);
        }
      }
    });

    const sellerArray = Array.from(allSellers);
    setSellers(sellerArray);
  }, [username]);

 
  useEffect(() => {
    if (roomId) {
      const storedMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
      const roomMessages = storedMessages.filter((m) => m.roomId === roomId);
      setMessages(roomMessages);
    }
  }, [roomId]);


  useEffect(() => {
    const allMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
    const uniqueSenders = new Set();
    const unreadMap = {};

    allMessages.forEach((msg) => {
      const room = [msg.sender, msg.receiver].sort().join("-");
      if (msg.receiver === username && msg.sender !== username) {
        uniqueSenders.add(msg.sender);
        if (!msg.read) {
          unreadMap[room] = (unreadMap[room] || 0) + 1;
        }
      }
    });

    setSenders(Array.from(uniqueSenders));
    setUnreadCounts(unreadMap);
  }, [username]);

 
useEffect(() => {
  const handleReceiveMessage = (newMsg) => {
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
    storedMessages.push({ ...newMsg, read: false });
    localStorage.setItem("chatMessages", JSON.stringify(storedMessages));

    if (newMsg.roomId === roomId) {
      setMessages((prev) => [...prev, newMsg]);
    } else if (newMsg.receiver === email) {
      setUnreadCounts((prev) => ({
        ...prev,
        [newMsg.roomId]: (prev[newMsg.roomId] || 0) + 1,
      }));
      setNewMessageNotification(newMsg.sender);
      alert("You have a new message");
    }
  };

  socket.on("receive-message", handleReceiveMessage);

  return () => {
    socket.off("receive-message", handleReceiveMessage); // cleanup buraya
  };
}, [roomId, email]);  // username yerine email daha tutarlı olur





  const joinRoomWithUser = (otherUserEmail) => {
  setSelectedUser(otherUserEmail); // artık selectedUser e-posta
  const room = [email, otherUserEmail].sort().join("-");
  setRoomId(room);
  socket.emit("join-room", room);
  setUnreadCounts((prev) => ({ ...prev, [room]: 0 }));
  setNewMessageNotification(null);
};



  const sendChat = (e) => {
    e.preventDefault();
    if (!msg.trim() || !selectedUser) return;


const sellerEmail = localStorage.getItem("sellerEmail");
const room = [email, sellerEmail].sort().join("-");


    const newMessage = {
  roomId,
  sender: email,              // e-posta ile gönder
  receiver: selectedUser,     // bu da e-posta
  productID,
  text: msg,
  read: true,
};


    socket.emit("send-message", newMessage);

    const storedMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
    storedMessages.push(newMessage);
    localStorage.setItem("chatMessages", JSON.stringify(storedMessages));

    setMessages((prev) => [...prev, newMessage]);
    setMsg("");
  };

  return (
    <Container>
      <Sidebar>
        <h3>User: {username}</h3>
        <h4>Seller</h4>
      
<ul>
  {sellers.length === 0 && <li>Satıcı bulunamadı.</li>}
  {sellers.map((seller) => {
    const isSellerUsername = seller === sellerUsername;
    return (
      <li
        key={seller}
        className={isSellerUsername ? "active" : "disabled"}
        style={{
          cursor: isSellerUsername ? "pointer" : "default",
          color: isSellerUsername ? "white" : "gray",
          backgroundColor: isSellerUsername ? "#4caf50" : "#eee",
          borderRadius: "5px",
          margin: "5px 0",
          padding: "10px",
          pointerEvents: isSellerUsername ? "auto" : "none", 
          userSelect: isSellerUsername ? "auto" : "none",
        }}
        onClick={() => {
          if (isSellerUsername) joinRoomWithUser(seller);
        }}
      >
        {seller}
      </li>
    );
  })}
</ul>


<div style={{ marginTop: "1rem" }}>
  <h4>Sender:</h4>
<ul>
  {JSON.parse(localStorage.getItem("all_usernames") || "[]")
    .filter(
      (sender) =>
        sender !== null &&               
        typeof sender === "string" &&   
        sender.trim() !== "" &&          
        sender !== username           
    )
    .map((sender) => {
      const room = [username, sender].sort().join("-");
      const isActive = selectedUser === sender;
      return (
        <li
          key={sender}
          style={{
            cursor: "pointer",
            color: isActive ? "white" : "gray",
            backgroundColor: isActive ? "#2196f3" : "#eee",
            borderRadius: "5px",
            margin: "5px 0",
            padding: "10px",
          }}
          onClick={() => joinRoomWithUser(sender)}
        >
          {sender}
          {unreadCounts[room] > 0 && (
            <UnreadBadge>{unreadCounts[room]}</UnreadBadge>
          )}
        </li>
      );
    })}
</ul>


</div>


      </Sidebar>

      <MainContent>
      <div className="chat-body">
    <div className="messages">
      {messages.length === 0 ? (
        <p>No messages.</p>
      ) : (
        messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.sender === username ? "sent" : "received"}`}
          >
            <strong>{m.sender}: </strong> {m.text}
          </div>
           ))
          )}
  <form className="chat-input" onSubmit={sendChat}>
    <input
      type="text"
      placeholder="Write your messages..."
      value={msg}
      onChange={(e) => setMsg(e.target.value)}
      disabled={!selectedUser}
    />
    <button type="submit" disabled={!selectedUser || !msg.trim()}>
      <IoMdSend size={24} />
    </button>
  </form>

  
       
    </div>
  </div>

  {newMessageNotification && (
    <NotificationButton onClick={() => setNewMessageNotification(null)}>
      Yeni mesaj: {newMessageNotification} tarafından gönderildi.
    </NotificationButton>
  )}
</MainContent>

    </Container>
  );
};

export default ChatWithDashboard;

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 25%;
  background-color: #f4f4f4;
  padding: 1rem;
  border-right: 1px solid #ddd;

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    position: relative;
  }

  li.active {
    background-color: #4caf50;
    color: white;
    pointer-events: none;
  }

  li:hover:not(.disabled):not(.active) {
    background-color:
 #ddd;
    cursor: pointer;
  }
`;

const UnreadBadge = styled.span`
  background-color: red;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
  position: absolute;
  right: 10px;
  top: 10px;
`;

const MainContent = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  position: relative; /* chat-input için bağlam */

  .chat-body {
    overflow-y: auto;
    flex-grow: 1;
    max-height: calc(100vh - 120px); /* Chat input ve üst padding için alan bırak */
    padding-bottom: 60px; /* chat-input yüksekliği kadar boşluk */
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .message {
    max-width: 60%;
    padding: 10px;
    border-radius: 8px;
    font-size: 14px;
    word-wrap: break-word;
  }

  .sent {
    align-self: flex-end;
    background-color: #daf8cb;
  }

  .received {
    align-self: flex-start;
    background-color: #e6e6e6;
  }

  .chat-input {
    position: fixed;
    bottom: 0;
    left: 25%; /* Sidebar %25 genişlikte, buraya göre ayar */
    width: 75%;
    display: flex;
    gap: 38px;
    padding: 10px;
    background-color: #f9f9f9;
    border-top: 1px solid #ccc;
    z-index: 1000;
  }
`;



const NotificationButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  z-index: 999;
  cursor: pointer;
`;
