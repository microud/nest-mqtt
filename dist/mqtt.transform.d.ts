import { MqttMessageTransformer } from './mqtt.interface';
export declare const JsonTransform: MqttMessageTransformer;
export declare const TextTransform: MqttMessageTransformer;
export declare function getTransform(transform: 'json' | 'text' | MqttMessageTransformer): MqttMessageTransformer;
