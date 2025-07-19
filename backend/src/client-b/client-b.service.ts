import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientBService {
  private readonly logger = new Logger(ClientBService.name);

  constructor(@Inject('RABBITMQ_CLIENT_B') private client: ClientProxy) {}

  async sendMessageToClientA(message: string): Promise<void> {
    const payload = {
      sender: 'ClientB',
      message,
    };

    this.logger.log(`Sending payload to ClientA: ${JSON.stringify(payload)}`);

    await firstValueFrom(this.client.emit('to-clientA', payload));
  }
}
