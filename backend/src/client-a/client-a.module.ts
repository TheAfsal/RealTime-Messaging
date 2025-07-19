import { Module } from '@nestjs/common';
import { ClientAController } from './client-a.controller';
import { ClientAService } from './client-a.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagingGateway } from '../gateway/messaging.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT_A',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
          ],
          queue: process.env.RABBITMQ_QUEUE_B || 'to-clientB',
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
    ]),
  ],
  controllers: [ClientAController],
  providers: [
    ClientAService,
    MessagingGateway,
    // {
    //   provide: 'RABBITMQ_CLIENT_A',
    //   useExisting: 'RABBITMQ_CLIENT_A_PUBLISHER',
    // },
  ],
})
export class ClientAModule {}
