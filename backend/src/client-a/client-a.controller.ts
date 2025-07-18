import { Controller, Get, Query } from '@nestjs/common';
import { ClientAService } from './client-a.service';
import { MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { MessagingGateway } from '../gateway/messaging.gateway';
import { Channel, Message } from 'amqplib';

@Controller('client-a')
export class ClientAController {
  constructor(
    private readonly clientAService: ClientAService,
    private readonly messagingGateway: MessagingGateway,
  ) {}

  @Get('send')
  async sendMessage(@Query('message') message: string) {
    return this.clientAService.sendMessageToClientB(message || 'Hello B');
  }

  @MessagePattern('to-clientA')
  handleMessageFromClientB(
    data: { sender: string; message: string },
    @Ctx() context: RmqContext,
  ) {
    try {
      console.log(`Client A received: ${data.message} from ${data.sender}`);
      this.messagingGateway.notifyClientA(`[${data.sender}]: ${data.message}`);
      const channel = context.getChannelRef() as Channel;
      const originalMsg = context.getMessage() as Message;
      channel.ack(originalMsg);
      return { status: 'Message received and acknowledged' };
    } catch (error) {
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
