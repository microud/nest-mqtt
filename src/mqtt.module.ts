import { DynamicModule, Logger, Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { createClientProvider } from './client.provider';
import { MqttExplorer } from './mqtt.explorer';
import { DiscoveryModule } from '@nestjs/core';
import { IMqttOptions } from './mqtt.interface';

@Module({})
export class MqttModule {
  public static forRoot(options: IMqttOptions): DynamicModule {
    return {
      module: MqttModule,
      imports: [DiscoveryModule],
      providers: [
        createClientProvider(options),
        MqttExplorer,
        MqttService,
        { provide: Logger, useValue: new Logger('MqttModule') },
      ],
      exports: [MqttService],
    };
  }
}
