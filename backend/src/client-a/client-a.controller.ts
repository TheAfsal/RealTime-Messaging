import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ClientAService } from './client-a.service';

@Controller('client-a')
export class ClientAController {
  private readonly logger = new Logger(ClientAController.name);

  constructor(private readonly clientAService: ClientAService) {
    this.logger.log('Client A controller initialized');
  }

  @Get('send')
  async sendMessage(@Query('message') message: string) {
    const finalMessage = message || 'Hello B';
    this.logger.log(`Sending message to Client B: ${finalMessage}`);
    return this.clientAService.sendMessageToClientB(finalMessage);
  }
}
