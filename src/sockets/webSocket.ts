import { Server, Socket } from "socket.io";

const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket: Socket) => {
    socket.on("joinEventRoom", (eventId: string) => {
      socket.join(eventId);
      socket.emit("roomStatus", `Joined room: ${eventId}`);
    });
  });

  io.listen(7777);
};

export default setupSocket;
