import { Logger, Provider } from '@nestjs/common';
import { connect } from 'mqtt';
import { IMqttOptions } from './mqtt.interface';
import { MQTT_CLIENT_INSTANCE } from './mqtt.constants';

export function createClientProvider(options: IMqttOptions): Provider {
  return {
    provide: MQTT_CLIENT_INSTANCE,
    useFactory: (logger: Logger) => {
      const client = connect(`mqtt://${options.host}`, options);

      client.on('connect', () => {
        logger.log('MQTT Connected');
      });

      client.on('disconnect', () => {

      });

      return client;
    },
    inject: [Logger],
  };
}
