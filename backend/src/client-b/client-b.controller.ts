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

interface MessagePayload {
  sender: string;
  message: string;
}

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
  async sendMessage(@Query('message') message: string) {
    const finalMessage = message || 'Hello A';
    this.logger.log(`Sending message to Client A: ${finalMessage}`);
    try {
      await this.clientBService.sendMessageToClientA(finalMessage);
      this.logger.log(`Message sent successfully: ${finalMessage}`);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to send message: ${err.message}`, err.stack);
      throw new Error(`Send failed: ${err.message}`);
    }
  }

  @MessagePattern('to-clientB')
  handleMessageFromClientA(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    const rawContent = originalMsg.content.toString();
    this.logger.log('Raw message content: ' + rawContent);

    try {
      const parsed = JSON.parse(rawContent) as { data: MessagePayload };
      const { sender, message } = parsed.data;

      if (!message) {
        throw new Error('Missing message in payload');
      }

      this.messagingGateway.notifyClientB(`[${sender}] ${message}`);
      channel.ack(originalMsg);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Error processing message from ${originalMsg.properties?.appId || 'unknown'}: ${err.message}`,
        err.stack,
      );
      channel.nack(originalMsg, false, false);
    }
  }
}
