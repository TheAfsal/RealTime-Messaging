import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ClientAService } from './client-a.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { MessagingGateway } from 'src/gateway/messaging.gateway';

@Controller('client-a')
export class ClientAController {
  private readonly logger = new Logger(ClientAController.name);

  constructor(
    private readonly clientAService: ClientAService,
    private readonly messagingGateway: MessagingGateway,
  ) {
    this.logger.log('Client A controller initialized');
  }

  @Get('send')
  sendMessage(@Query('message') message: string) {
    const finalMessage = message || 'Hello B';
    this.logger.log(`Sending message to Client B: ${finalMessage}`);
    return this.clientAService.sendMessageToClientB(finalMessage);
  }

  @MessagePattern('to-clientA')
  handleMessageFromClientB(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    this.logger.log('Raw message content: ' + originalMsg.content.toString());

    try {
      const { data } = JSON.parse(originalMsg.content.toString());
      const { sender, message } = data;

      if (!message) {
        throw new Error('Missing message');
      }

      this.logger.log(`Client A received: ${message} from ${sender}`);
      this.messagingGateway.notifyClientA(`[${sender}] ${message}`);
      channel.ack(originalMsg);
    } catch (err: any) {
      this.logger.error(`Error processing message: ${err.message}`);
      channel.nack(originalMsg, false, false);
    }
  }
}
