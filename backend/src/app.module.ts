import { Module } from '@nestjs/common';
import { ClientAModule } from './client-a/client-a.module';
import { ClientBModule } from './client-b/client-b.module';
import { MessagingGateway } from './gateway/messaging.gateway';

@Module({
  imports: [ClientAModule, ClientBModule],
  controllers: [],
  providers: [MessagingGateway],
})
export class AppModule {}
