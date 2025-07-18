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
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'to-clientB',
          queueOptions: { durable: true },
          noAck: false,
        },
      },
    ]),
  ],
  controllers: [ClientAController],
  providers: [ClientAService, MessagingGateway],
})
export class ClientAModule {}
