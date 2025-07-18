import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { retry } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable()
export class ClientBService {
  private readonly logger = new Logger(ClientBService.name);

  constructor(@Inject('RABBITMQ_CLIENT_B') private client: ClientProxy) {}

  async sendMessageToClientA(message: string) {
    const payload = { sender: 'clientB', message };
    try {
      await this.client
        .emit('to-clientA', payload)
        .pipe(
          retry({
            count: 5,
            delay: (error, attempt) => {
              if (error instanceof Error) {
                this.logger.warn(
                  `Retry attempt ${attempt} for sending message: ${error.message}`,
                );
                return timer(1000 * Math.pow(2, attempt));
              } else {
                this.logger.error('Unknown error occurred during message send');
                throw new Error('Unknown error occurred');
              }
            },
          }),
        )
        .toPromise();

      return { status: 'Message sent to Client A' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to send message after retries: ${error.message}`,
        );
        throw new Error(`Failed to send message: ${error.message}`);
      } else {
        this.logger.error('Unknown error occurred during message send');
        throw new Error('Unknown error occurred');
      }
    }
  }
}
