import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const App = () => {

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected");
      console.log(socket.id);
      
    });

    socket.on("WELCOME", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };

  }, []);

  return <div>App</div>;
};

export default App;
