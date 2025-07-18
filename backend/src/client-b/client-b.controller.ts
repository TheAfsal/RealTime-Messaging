import { Controller, Get, Query } from '@nestjs/common';
import { ClientBService } from './client-b.service';
import { MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { MessagingGateway } from '../gateway/messaging.gateway';
import { Channel, Message } from 'amqplib';

@Controller('client-b')
export class ClientBController {
  constructor(
    private readonly clientBService: ClientBService,
    private readonly messagingGateway: MessagingGateway,
  ) {}

  @Get('send')
  async sendMessage(@Query('message') message: string) {
    return this.clientBService.sendMessageToClientA(message || 'Hello A');
  }

  @MessagePattern('to-clientB')
  handleMessageFromClientA(
    data: { sender: string; message: string },
    @Ctx() context: RmqContext,
  ) {
    try {
      console.log(`Client B received: ${data.message} from ${data.sender}`);
      this.messagingGateway.notifyClientB(`[${data.sender}]: ${data.message}`);

      const channel = context.getChannelRef() as Channel;
      const originalMsg = context.getMessage() as Message;

      channel.ack(originalMsg);

      return { status: 'Message received and acknowledged' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error processing message: ${error.message}`);
        throw error;
      } else {
        console.error('Unknown error occurred while processing message');
        throw new Error('Unknown error');
      }
    }
  }
}
