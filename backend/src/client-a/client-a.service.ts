import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ClientAService {
  private readonly logger = new Logger(ClientAService.name);

  constructor(@Inject('RABBITMQ_CLIENT_A') private client: ClientProxy) {}

  sendMessageToClientB(message: string) {
    const payload = {
      sender: 'ClientA',
      message,
    };

    this.logger.log(`Sending payload to ClientB: ${JSON.stringify(payload)}`);

    this.client.emit('to-clientB', payload);
  }
}
