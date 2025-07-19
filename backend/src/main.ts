import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST',
  });

  // Microservice for consuming messages for clientA (from queue 'to-clientA')
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'to-clientA',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  // Microservice for consuming messages for clientB (from queue 'to-clientB')
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'to-clientB',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
  console.log('Backend running on http://localhost:3001');
}

bootstrap();
