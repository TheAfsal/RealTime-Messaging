import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ClientAService } from './client-a.service';
import { MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { MessagingGateway } from '../gateway/messaging.gateway';
import { Channel, Message } from 'amqplib';

interface MessagePayload {
  sender: string;
  message: string;
}

@Controller('client-a')
export class ClientAController {
  private readonly logger = new Logger(ClientAController.name);

  constructor(
    private readonly clientAService: ClientAService,
    private readonly messagingGateway: MessagingGateway,
  ) {
    this.logger.log('Client A controller initialized');
  }

  // HTTP GET endpoint to send a message from Client A to Client B
  @Get('send')
  async sendMessage(@Query('message') message: string): Promise<void> {
    const finalMessage = message || 'Hello B';
    this.logger.log(`Attempting to send message to Client B: ${finalMessage}`);
    try {
      await this.clientAService.sendMessageToClientB(finalMessage);
      this.logger.log(`Message sent successfully: ${finalMessage}`);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to send message: ${err.message}`, err.stack);
      throw new Error(`Send failed: ${err.message}`);
    }
  }

  // RabbitMQ listener for messages sent to 'to-clientA' queue
  @MessagePattern('to-clientA')
  handleMessageFromClientB(@Ctx() context: RmqContext): void {
    const channel: Channel = context.getChannelRef() as Channel;
    const originalMsg: Message = context.getMessage() as Message;

    const rawContent = originalMsg.content.toString();
    this.logger.log('Raw message content: ' + rawContent);

    try {
      const parsed = JSON.parse(rawContent) as { data: MessagePayload };
      const { sender, message } = parsed.data;

      if (!message) {
        throw new Error('Missing message in payload');
      }

      this.logger.log(`Client A received: ${message} from ${sender}`);
      this.messagingGateway.notifyClientA(`[${sender}] ${message}`);
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
