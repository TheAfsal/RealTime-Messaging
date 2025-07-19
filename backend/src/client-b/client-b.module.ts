import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientBController } from './client-b.controller';
import { ClientBService } from './client-b.service';
import { MessagingGateway } from '../gateway/messaging.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT_B',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
          ],
          queue: process.env.RABBITMQ_QUEUE_A || 'to-clientA',
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
    ]),
  ],
  controllers: [ClientBController],
  providers: [
    ClientBService,
    MessagingGateway,
    // {
    //   provide: 'RABBITMQ_CLIENT_B',
    //   useExisting: 'RABBITMQ_CLIENT_B_PUBLISHER',
    // },
  ],
})
export class ClientBModule {}
