// App.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [update, setUpdate] = useState("");
  const [socket, setSocket] = useState(null); // Store socket instance

  // Connect to the Socket.IO server when the component mounts
  useEffect(() => {
    const newSocket = io("http://10.228.68.73:4000");
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleJoin = () => {
    socket.emit("join", username);
  };

  const handleSendMessage = () => {
    socket.emit("update", username, message);
  };

  useEffect(() => {
    // Listen for messages and updates
    if (socket) {
      socket.on("message", (msg) => {
        setUpdate(msg);
      });

      socket.on("update", (data) => {
        setUpdate(`Received update: ${data}`);
      });
    }
  }, [socket]);

  return (
    <div className="App">
      <h1>React App</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
      <br />
      <input
        type="text"
        placeholder="Enter a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send Message</button>
      <p>{update}</p>
    </div>
  );
}

export default App;
