import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class MessagingGateway {
  @WebSocketServer()
  server: Server;

  notifyClientA(message: string) {
    this.server.emit('message-to-clientA', message);
  }

  notifyClientB(message: string) {
    this.server.emit('message-to-clientB', message);
  }
}
