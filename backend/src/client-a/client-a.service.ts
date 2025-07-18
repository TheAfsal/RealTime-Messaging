import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { retry } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable()
export class ClientAService {
  private readonly logger = new Logger(ClientAService.name);

  constructor(@Inject('RABBITMQ_CLIENT_A') private client: ClientProxy) {}

  async sendMessageToClientB(message: string) {
    const payload = { sender: 'clientA', message };
    try {
      // Attempt to send message with retries
      await this.client
        .emit('to-clientB', payload)
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

      return { status: 'Message sent to Client B' };
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
