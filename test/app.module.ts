import { Module } from '@nestjs/common';
import { MqttModule } from '../dist';

@Module({
  imports: [MqttModule.forRoot({})],
})
export class AppModule {}
