import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// app.use(cors({ origin: "http://localhost:5173" }));

// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" },
// });

app.use(cors({
  origin: "*",
}));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("CONNECTED:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);

    io.to(room).emit("system", `${socket.id} joined room`);
  });

  socket.on("message", ({ room, to, text }) => {
    console.log("MSG:", { room, to, text });

    // PRIVATE CHAT
    if (to) {
      io.to(to).emit("message", {
        text,
        sender: socket.id,
        type: "private",
      });
      return;
    }

    // GROUP CHAT
    if (room) {
      io.to(room).emit("message", {
        text,
        sender: socket.id,
        type: "group",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("DISCONNECTED:", socket.id);
  });
});

// server.listen(5000, () => console.log("RUNNING"));
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});



















// import express from "express";
// import { Server } from "socket.io";
// import { createServer } from "http";
// import cors from "cors";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";

// const port = 4000;
// const secretKeyJWT = "hgdjhdjkjdkvnfl";

// const app = express();
// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST"],
//   credentials: true,
// }));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.get("/login", (req, res) => {

//   const token = jwt.sign(
//     { _id: "12345" },
//     secretKeyJWT
//   );

//   res.json({
//     message: "Login Success",
//     token,
//   });

// });

// // app.get("/login", (req, res) => {
// //   const token = jwt.sign({_id: "yaguyaguishjd" }, secretKeyJWT);

// //   res
// //     .cookie("token", token, {httpOnly: true, secure: false, sameSite: "lax"})
// //     .json({
// //       message: "Login Success",
// //     });
// // });

// io.use((socket, next) => {

//   try {

//     const token =
//       socket.handshake.auth.token;

//     console.log(token);

//     if (!token) {
//       return next(
//         new Error("No Token")
//       );
//     }

//     const decoded = jwt.verify(
//       token,
//       secretKeyJWT
//     );

//     console.log(decoded);

//     next();

//   } catch (error) {

//     console.log(error.message);

//     next(
//       new Error("Authentication Error")
//     );

//   }

// });



// // io.use((socket, next) => {
// //   cookieParser()(socket.request, socket.request.res, (err) => {

// //     if(err) return next(err)
// //       const token = socket.request.cookies.token;

// //     if(!token) return next(new Error("Authentication Error"))
// //       const decoded = jwt.verify(token, secretKeyJWT);
      
// //     next();

// //   });

// // });

// io.on("connection", (socket) => {
//   console.log("User Connected", socket.id);

//   socket.on("message", ({room, message}) => {
//     console.log({room, message});
//     socket.to(room).emit("recieve-message", message);
//   });

//   socket.on("join-room", (room) =>{
//     socket.join(room);
//     console.log(`User Joined Room ${room}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });

// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });