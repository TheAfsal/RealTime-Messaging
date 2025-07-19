import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientAService {
  private readonly logger = new Logger(ClientAService.name);

  constructor(@Inject('RABBITMQ_CLIENT_A') private client: ClientProxy) {}

  async sendMessageToClientB(message: string): Promise<void> {
    const payload = {
      sender: 'ClientA',
      message,
    };

    this.logger.log(`Sending payload to ClientB: ${JSON.stringify(payload)}`);

    await firstValueFrom(this.client.emit('to-clientB', payload));
  }
}
