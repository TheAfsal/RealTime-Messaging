import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientBController } from './client-b.controller';
import { ClientBService } from './client-b.service';
import { MessagingGateway } from '../gateway/messaging.gateway';

@Module({
  imports: [
    ClientsModule.register([
      // Publisher config
      {
        name: 'RABBITMQ_CLIENT_B_PUBLISHER',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'to-clientA',
          queueOptions: { durable: true },
          noAck: true, // publisher doesn't care about acks
        },
      },
      // Consumer config
      {
        name: 'RABBITMQ_CLIENT_B_CONSUMER',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'to-clientB',
          queueOptions: { durable: true },
          noAck: false, // we want to manually ack messages
        },
      },
    ]),
  ],
  controllers: [ClientBController],
  providers: [
    ClientBService,
    MessagingGateway,
    {
      provide: 'RABBITMQ_CLIENT_B', // alias for DI
      useExisting: 'RABBITMQ_CLIENT_B_PUBLISHER',
    },
  ],
})
export class ClientBModule {}
