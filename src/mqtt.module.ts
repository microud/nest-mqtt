import {
  DynamicModule,
  Global,
  Module,
} from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { createClientProvider } from './client.provider';
import { MqttExplorer } from './mqtt.explorer';
import { DiscoveryModule } from '@nestjs/core';
import { createLoggerProvider, createOptionProviders } from './options.provider';
import {
  MqttModuleAsyncOptions,
  MqttModuleOptions,
} from './mqtt.interface';
import {
  MQTT_LOGGER_PROVIDER,
  MQTT_OPTION_PROVIDER,
} from './mqtt.constants';

@Global()
@Module({
  imports: [DiscoveryModule],
  exports: [MqttService],
})
export class MqttModule {

  public static forRootAsync(options: MqttModuleAsyncOptions): DynamicModule {
    return {
      module: MqttModule,
      providers: [
        ...createOptionProviders(options),
        createLoggerProvider(options),
        createClientProvider(),
        MqttExplorer,
        MqttService,
      ],
      exports: [],
    };
  }

  public static forRoot(options: MqttModuleOptions): DynamicModule {
    return {
      module: MqttModule,
      providers: [
        {
          provide: MQTT_OPTION_PROVIDER,
          useValue: options,
        },
        createLoggerProvider(options),
        createClientProvider(),
        MqttExplorer,
        MqttService,
      ],
      exports: [],
    };
  }
}
