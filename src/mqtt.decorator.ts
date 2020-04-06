import { CustomDecorator, SetMetadata } from '@nestjs/common';
import {
  MQTT_SUBSCRIBE_TOPIC,
  MQTT_SUBSCRIBER_PARAMS,
} from './mqtt.constants';
import {
  IMqttMessageTransformer,
  IMqttSubscriberParameter,
} from './mqtt.interface';

export function Subscribe(topic: string | string[] | IMqttSubscriberParameter): CustomDecorator;
export function Subscribe(topicOrOptions): CustomDecorator {
  if (typeof topicOrOptions === 'string' || Array.isArray(topicOrOptions)) {
    return SetMetadata(MQTT_SUBSCRIBE_TOPIC, {
      topic: topicOrOptions,
    });
  } else {
    return SetMetadata(MQTT_SUBSCRIBE_TOPIC, topicOrOptions);
  }
}

function SetParameter(parameter: Partial<IMqttSubscriberParameter>) {
  return (
    target: object,
    propertyKey: string | symbol,
    paramIndex: number,
  ) => {
    const params =
      Reflect.getMetadata(MQTT_SUBSCRIBER_PARAMS, target[propertyKey]) || [];
    params.push({
      index: paramIndex,
      ...parameter,
    });
    Reflect.defineMetadata(MQTT_SUBSCRIBER_PARAMS, params, target[propertyKey]);
  };
}

export function Topic() {
  return SetParameter({
    type: 'topic',
  });
}

export function Packet() {
  return SetParameter({
    type: 'packet',
  });
}

export function Payload(transform?: 'json' | 'text' | IMqttMessageTransformer) {
  return SetParameter({
    type: 'payload',
    transform,
  });
}

export function Params() {
  return SetParameter({
    type: 'params',
  });
}
