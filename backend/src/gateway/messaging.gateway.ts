import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:5173' },
})
export class MessagingGateway {
  @WebSocketServer()
  server: Server;

  notifyClientA(message: string) {
    this.server.emit('message-to-client-a', message);
  }

  notifyClientB(message: string) {
    this.server.emit('message-to-client-b', message);
  }
}
