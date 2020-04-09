import { IClientOptions } from 'mqtt';
import { LoggerService, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export type IMqttMessageTransformer = (payload: Buffer) => any;

export type LoggerConstructor = new (...params) => LoggerService;

export interface IMqttModuleOptions extends IClientOptions {
  /**
   * Global queue subscribe.
   * All topic will be prepend '$queue/' prefix automatically.
   * More information is here:
   * https://docs.emqx.io/broker/latest/cn/advanced/shared-subscriptions.html
   */
  queue?: boolean;

  /**
   * Global shared subscribe.
   * All topic will be prepend '$shared/group/' prefix automatically.
   * More information is here:
   * https://docs.emqx.io/broker/latest/cn/advanced/shared-subscriptions.html
   */
  shared?: string;
}

export interface MqttSubscribeOptions {
  topic: string | string[];
  queue?: boolean;
  shared?: string;
  transform?: 'json' | 'text' | IMqttMessageTransformer;
}

export interface MqttSubscriberParameter {
  index: number;
  type: 'payload' | 'topic' | 'packet' | 'params';
  transform?: 'json' | 'text' | IMqttMessageTransformer;
}

export interface MqttSubscriber {
  topic: string;
  handle: any;
  route: string;
  regexp: RegExp;
  options: MqttSubscribeOptions;
  parameters: MqttSubscriberParameter[];
}

export interface MqttLoggerOptions {
  useValue?: LoggerService;
  useClass?: Type<LoggerService>;
}

export interface MqttModuleOptions extends IClientOptions {
  /**
   * Global queue subscribe.
   * All topic will be prepend '$queue/' prefix automatically.
   * More information is here:
   * https://docs.emqx.io/broker/latest/cn/advanced/shared-subscriptions.html
   */
  queue?: boolean;

  /**
   * Global shared subscribe.
   * All topic will be prepend '$shared/group/' prefix automatically.
   * More information is here:
   * https://docs.emqx.io/broker/latest/cn/advanced/shared-subscriptions.html
   */
  shared?: string;

  logger?: MqttLoggerOptions;
}

export interface MqttOptionsFactory {
  createMqttConnectOptions(): Promise<MqttModuleOptions> | MqttModuleOptions;
}

export interface MqttModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<MqttOptionsFactory>;
  useClass?: Type<MqttOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MqttModuleOptions> | MqttModuleOptions;
}
