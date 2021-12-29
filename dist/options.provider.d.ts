import { MqttModuleAsyncOptions, MqttModuleOptions } from './mqtt.interface';
import { Provider } from '@nestjs/common';
export declare function createOptionsProvider(options: MqttModuleAsyncOptions): Provider;
export declare function createOptionProviders(options: MqttModuleAsyncOptions): Provider[];
export declare function createLoggerProvider(options: MqttModuleOptions | MqttModuleAsyncOptions): Provider;
