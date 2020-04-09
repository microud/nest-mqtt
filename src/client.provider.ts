import { Provider, Logger } from '@nestjs/common';
import { connect } from 'mqtt';
import { MqttModuleOptions } from './mqtt.interface';
import { MQTT_CLIENT_INSTANCE, MQTT_OPTION_PROVIDER, MQTT_LOGGER_PROVIDER } from './mqtt.constants';

export function createClientProvider(): Provider {
  return {
    provide: MQTT_CLIENT_INSTANCE,
    useFactory: (options: MqttModuleOptions, logger: Logger) => {
      const client = connect(options);

      client.on('connect', () => {
        logger.log('MQTT connected');
        // console.log(packet);
      });

      client.on('disconnect', packet => {
        logger.log('MQTT disconnected');
      });

      client.on('error', error => {
      });

      client.on('reconnect', () => {
        logger.log('MQTT reconnecting');
      });

      client.on('close', error => {
        logger.log('MQTT closed');
      });

      client.on('offline', () => {
        logger.log('MQTT offline');
      });

      return client;
    },
    inject: [MQTT_OPTION_PROVIDER, MQTT_LOGGER_PROVIDER],
  };
}
