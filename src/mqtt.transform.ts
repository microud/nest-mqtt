import { IMqttMessageTransformer } from './mqtt.interface';

export const JsonTransform: IMqttMessageTransformer = payload => {
  return JSON.parse(payload.toString('utf-8'));
};

export const TextTransform: IMqttMessageTransformer = payload => {
  return payload.toString('utf-8');
};

export function getTransform(
  transform: 'json' | 'text' | IMqttMessageTransformer,
) {
  if (typeof transform === 'function') {
    return transform;
  } else {
    if (transform === 'text') {
      return TextTransform;
    } else {
      return JsonTransform;
    }
  }
}
