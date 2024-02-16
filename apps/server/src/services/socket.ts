import { Server } from "socket.io";
import Redis from "ioredis";

const publiser = new Redis(
  "redis://default:AVNS_TP3HuZdg1QJo51Sg0h2@redis-3d5d04e8-ku-chat-application.a.aivencloud.com:27628"
);

const subscriber = new Redis(
  "redis://default:AVNS_TP3HuZdg1QJo51Sg0h2@redis-3d5d04e8-ku-chat-application.a.aivencloud.com:27628"
);

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Server...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    subscriber.subscribe("MESSAGES");
  }

  public initListners() {
    const io = this._io;
    console.log("Initializing Socket Listners...");
    io.on("connect", (socket) => {
      console.log("New Socket Connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Received", message);
        //Publish message to redis
        await publiser.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    subscriber.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
