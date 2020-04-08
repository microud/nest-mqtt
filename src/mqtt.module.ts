import {
  DynamicModule,
  Global,
  Module,
  Provider,
} from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { createClientProvider } from './client.provider';
// import { createLoggerProvider } from './logger.provider';
import { MqttExplorer } from './mqtt.explorer';
import { DiscoveryModule } from '@nestjs/core';
import { createOptionProviders } from './options.provider';
import {
  MqttModuleAsyncOptions,
  IMqttModuleOptions,
  MqttOptionsFactory,
} from './mqtt.interface';
import {
  MQTT_CLIENT_INSTANCE,
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
        // createLoggerProvider(options.loggerClass),
        createClientProvider(),
        MqttExplorer,
        MqttService,
      ],
      exports: [],
    };
  }

  public static forRoot(options: IMqttModuleOptions): DynamicModule {
    return {
      module: MqttModule,
      providers: [
        {
          provide: MQTT_OPTION_PROVIDER,
          useValue: options,
        },
        // createLoggerProvider(options.loggerClass),
        createClientProvider(),
        MqttExplorer,
        MqttService,
      ],
      exports: [],
    };
  }
}
