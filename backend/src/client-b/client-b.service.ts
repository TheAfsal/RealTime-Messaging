import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ClientBService {
  private readonly logger = new Logger(ClientBService.name);

  constructor(@Inject('RABBITMQ_CLIENT_B') private client: ClientProxy) {}

  sendMessageToClientA(message: string) {
    const payload = { sender: 'ClientB', message };
    this.logger.log(`Sending payload to ClientA: ${JSON.stringify(payload)}`);
    this.client.emit('to-clientA', payload);
  }
}
