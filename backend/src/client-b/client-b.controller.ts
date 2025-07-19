import { Controller, Get, Logger, Query } from '@nestjs/common';
import {
  MessagePattern,
  Ctx,
  RmqContext,
  Payload,
} from '@nestjs/microservices';
import { MessagingGateway } from '../gateway/messaging.gateway';
import { Channel, Message } from 'amqplib';
import { ClientBService } from './client-b.service';

@Controller('client-b')
export class ClientBController {
  private readonly logger = new Logger(ClientBController.name);

  constructor(
    private readonly clientBService: ClientBService,
    private readonly messagingGateway: MessagingGateway,
  ) {
    this.logger.log('Client B consumer client initialized');
  }

  @Get('send')
  sendMessage(@Query('message') message: string) {
    const finalMessage = message || 'Hello A';
    this.logger.log(`Sending message to Client A: ${finalMessage}`);
    return this.clientBService.sendMessageToClientA(finalMessage);
  }

  @MessagePattern('to-clientB')
  handleMessageFromClientA(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    this.logger.log('Raw message content: ' + originalMsg.content.toString());

    let parsedData;
    try {
      const { data } = JSON.parse(originalMsg.content.toString());
      parsedData = data;
      console.log(parsedData);

      this.logger.log('Parsed payload: ' + JSON.stringify(parsedData));

      const { sender, message } = parsedData;
      console.log(sender, message);

      if (!message) {
        throw new Error('Missing message');
      }

      this.messagingGateway.notifyClientB(`[${sender}] ${message}`);
      channel.ack(originalMsg);
    } catch (err: any) {
      this.logger.error(`Error processing message: ${err.message}`);
      channel.nack(originalMsg, false, false);
    }
  }
}
