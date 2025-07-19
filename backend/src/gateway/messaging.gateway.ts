import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class MessagingGateway {
  @WebSocketServer()
  server: Server;

  notifyClientA(message: string) {
    console.log('@@ notifyClientA:', message);
    this.server.emit('message-to-client-a', message);
  }

  notifyClientB(message: string) {
    console.log('@@ notifyClientB:', message);
    this.server.emit('message-to-client-b', message);
  }
}
