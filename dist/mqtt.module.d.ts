import { DynamicModule } from '@nestjs/common';
import { MqttModuleAsyncOptions, MqttModuleOptions } from './mqtt.interface';
export declare class MqttModule {
    static forRootAsync(options: MqttModuleAsyncOptions): DynamicModule;
    static forRoot(options: MqttModuleOptions): DynamicModule;
}
