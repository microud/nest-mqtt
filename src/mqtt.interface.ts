import { IClientOptions } from 'mqtt';

export type IMqttMessageTransformer = (payload: Buffer) => any;

export interface IMqttOptions extends IClientOptions {
  /**
   * Global queue subscribe.
   * All topic will be prepend '$queue/' prefix automatically.
   */
  queue?: boolean;
}

export interface IMqttSubscribeOptions {
  topic: string | string[];
  queue?: boolean;
  shared?: string;
  transform?: 'json' | 'text' | IMqttMessageTransformer;
}

export interface IMqttSubscriberParameter {
  index: number;
  type: 'payload' | 'topic' | 'packet' | 'params';
  transform?: 'json' | 'text' | IMqttMessageTransformer;
}

export interface IMqttSubscriber {
  topic: string;
  handle: any;
  regexp: RegExp;
  metadata: IMqttSubscribeOptions;
  parameters: IMqttSubscriberParameter[];
}
