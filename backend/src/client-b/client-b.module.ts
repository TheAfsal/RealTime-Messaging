import { Module } from '@nestjs/common';
import { ClientBController } from './client-b.controller';
import { ClientBService } from './client-b.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagingGateway } from '../gateway/messaging.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT_B',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'to-clientA',
          queueOptions: { durable: true },
          noAck: false,
        },
      },
    ]),
  ],
  controllers: [ClientBController],
  providers: [ClientBService, MessagingGateway],
})
export class ClientBModule {}
