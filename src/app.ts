import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import officerRouter from "./routes/officerRouter";
import soldierRoutes from "./routes/soldierRouter";
import eventRoutes from "./routes/eventRoutes";
import setupSocket from "./sockets/webSocket";
import http from "http";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const client = process.env.CLIENT_APP;
const server = http.createServer(app);

connectDB();

app.use(cors({
  origin: `[${client}, http://localhost:5173]`, 
  credentials: true 
}));app.use(express.json());
app.use("/api", officerRouter, soldierRoutes, eventRoutes);

setupSocket(server);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
