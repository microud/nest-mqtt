"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MqttModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttModule = void 0;
const common_1 = require("@nestjs/common");
const mqtt_service_1 = require("./mqtt.service");
const client_provider_1 = require("./client.provider");
const mqtt_explorer_1 = require("./mqtt.explorer");
const core_1 = require("@nestjs/core");
const options_provider_1 = require("./options.provider");
const mqtt_constants_1 = require("./mqtt.constants");
let MqttModule = MqttModule_1 = class MqttModule {
    static forRootAsync(options) {
        return {
            module: MqttModule_1,
            providers: [
                ...(0, options_provider_1.createOptionProviders)(options),
                (0, options_provider_1.createLoggerProvider)(options),
                (0, client_provider_1.createClientProvider)(),
                mqtt_explorer_1.MqttExplorer,
                mqtt_service_1.MqttService,
            ],
            exports: [],
        };
    }
    static forRoot(options) {
        return {
            module: MqttModule_1,
            providers: [
                {
                    provide: mqtt_constants_1.MQTT_OPTION_PROVIDER,
                    useValue: options,
                },
                (0, options_provider_1.createLoggerProvider)(options),
                (0, client_provider_1.createClientProvider)(),
                mqtt_explorer_1.MqttExplorer,
                mqtt_service_1.MqttService,
            ],
            exports: [],
        };
    }
};
MqttModule = MqttModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
        exports: [mqtt_service_1.MqttService],
    })
], MqttModule);
exports.MqttModule = MqttModule;
//# sourceMappingURL=mqtt.module.js.map