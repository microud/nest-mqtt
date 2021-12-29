"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientProvider = void 0;
const mqtt_1 = require("mqtt");
const mqtt_constants_1 = require("./mqtt.constants");
function createClientProvider() {
    return {
        provide: mqtt_constants_1.MQTT_CLIENT_INSTANCE,
        useFactory: (options, logger) => {
            const client = (0, mqtt_1.connect)(options);
            client.on('connect', () => {
                logger.log('MQTT connected');
            });
            client.on('disconnect', packet => {
                logger.log('MQTT disconnected');
            });
            client.on('error', error => {
                logger.error(error);
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
        inject: [mqtt_constants_1.MQTT_OPTION_PROVIDER, mqtt_constants_1.MQTT_LOGGER_PROVIDER],
    };
}
exports.createClientProvider = createClientProvider;
//# sourceMappingURL=client.provider.js.map