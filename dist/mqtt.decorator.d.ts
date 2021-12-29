import { CustomDecorator } from '@nestjs/common';
import { MqttMessageTransformer, MqttSubscribeOptions } from './mqtt.interface';
export declare function Subscribe(topic: string | string[] | MqttSubscribeOptions): CustomDecorator;
export declare function Topic(): (target: object, propertyKey: string | symbol, paramIndex: number) => void;
export declare function Packet(): (target: object, propertyKey: string | symbol, paramIndex: number) => void;
export declare function Payload(transform?: 'json' | 'text' | MqttMessageTransformer): (target: object, propertyKey: string | symbol, paramIndex: number) => void;
export declare function Params(): (target: object, propertyKey: string | symbol, paramIndex: number) => void;
