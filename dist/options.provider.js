"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoggerProvider = exports.createOptionProviders = exports.createOptionsProvider = void 0;
const common_1 = require("@nestjs/common");
const mqtt_constants_1 = require("./mqtt.constants");
function createOptionsProvider(options) {
    if (options.useFactory) {
        return {
            provide: mqtt_constants_1.MQTT_OPTION_PROVIDER,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };
    }
    if (options.useExisting) {
        return {
            provide: mqtt_constants_1.MQTT_OPTION_PROVIDER,
            useFactory: async (optionsFactory) => await optionsFactory.createMqttConnectOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
}
exports.createOptionsProvider = createOptionsProvider;
function createOptionProviders(options) {
    if (options.useExisting || options.useFactory) {
        return [createOptionsProvider(options)];
    }
    return [
        {
            provide: mqtt_constants_1.MQTT_CLIENT_INSTANCE,
            useFactory: async (optionFactory) => await optionFactory.createMqttConnectOptions(),
            inject: [options.useClass],
        },
        {
            provide: options.useClass,
            useClass: options.useClass,
        },
    ];
}
exports.createOptionProviders = createOptionProviders;
function createLoggerProvider(options) {
    if (!options.logger) {
        return {
            provide: mqtt_constants_1.MQTT_LOGGER_PROVIDER,
            useValue: new common_1.Logger('MqttModule'),
        };
    }
    else {
        if (options.logger.useClass) {
            return {
                provide: mqtt_constants_1.MQTT_LOGGER_PROVIDER,
                useClass: options.logger.useClass,
            };
        }
        else {
            return {
                provide: mqtt_constants_1.MQTT_LOGGER_PROVIDER,
                useValue: options.logger.useValue,
            };
        }
    }
}
exports.createLoggerProvider = createLoggerProvider;
//# sourceMappingURL=options.provider.js.map