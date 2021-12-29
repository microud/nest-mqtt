"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MqttExplorer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttExplorer = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mqtt_constants_1 = require("./mqtt.constants");
const mqtt_1 = require("mqtt");
const mqtt_transform_1 = require("./mqtt.transform");
let MqttExplorer = MqttExplorer_1 = class MqttExplorer {
    constructor(discoveryService, metadataScanner, logger, client, options) {
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.logger = logger;
        this.client = client;
        this.options = options;
        this.subscribers = [];
        this.reflector = new core_1.Reflector();
    }
    onModuleInit() {
        this.logger.log('MqttModule dependencies initialized');
        this.explore();
    }
    preprocess(options) {
        const processTopic = (topic) => {
            const queue = typeof options.queue === 'boolean' ? options.queue : this.options.queue;
            const share = typeof options.share === 'string' ? options.share : this.options.share;
            topic = topic.replace('$queue/', '')
                .replace(/^\$share\/([A-Za-z0-9]+)\//, '');
            if (queue) {
                return `$queue/${topic}`;
            }
            if (share) {
                return `$share/${share}/${topic}`;
            }
            return topic;
        };
        if (Array.isArray(options.topic)) {
            return options.topic.map(processTopic);
        }
        else {
            return processTopic(options.topic);
        }
    }
    subscribe(options, parameters, handle, provider) {
        this.client.subscribe(this.preprocess(options), err => {
            if (!err) {
                (Array.isArray(options.topic) ? options.topic : [options.topic])
                    .forEach(topic => {
                    this.subscribers.push({
                        topic,
                        route: topic.replace('$queue/', '')
                            .replace(/^\$share\/([A-Za-z0-9]+)\//, ''),
                        regexp: MqttExplorer_1.topicToRegexp(topic),
                        provider,
                        handle,
                        options,
                        parameters,
                    });
                });
            }
            else {
                this.logger.error(`subscribe topic [${options.topic} failed]`);
            }
        });
    }
    explore() {
        const providers = this.discoveryService.getProviders();
        providers.forEach((wrapper) => {
            const { instance } = wrapper;
            if (!instance) {
                return;
            }
            this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), key => {
                const subscribeOptions = this.reflector.get(mqtt_constants_1.MQTT_SUBSCRIBE_OPTIONS, instance[key]);
                const parameters = this.reflector.get(mqtt_constants_1.MQTT_SUBSCRIBER_PARAMS, instance[key]);
                if (subscribeOptions) {
                    this.subscribe(subscribeOptions, parameters, instance[key], instance);
                }
            });
        });
        this.client.on('message', (topic, payload, packet) => {
            const subscriber = this.getSubscriber(topic);
            if (subscriber) {
                const parameters = subscriber.parameters || [];
                const scatterParameters = [];
                for (const parameter of parameters) {
                    scatterParameters[parameter.index] = parameter;
                }
                try {
                    const transform = (0, mqtt_transform_1.getTransform)(subscriber.options.transform);
                    if (this.options.beforeHandle) {
                        this.options.beforeHandle(topic, payload, packet);
                    }
                    subscriber.handle.bind(subscriber.provider)(...scatterParameters.map(parameter => {
                        switch (parameter === null || parameter === void 0 ? void 0 : parameter.type) {
                            case 'payload':
                                return transform(payload);
                            case 'topic':
                                return topic;
                            case 'packet':
                                return packet;
                            case 'params':
                                return MqttExplorer_1.matchGroups(topic, subscriber.regexp);
                            default:
                                return null;
                        }
                    }));
                }
                catch (err) {
                    this.logger.error(err);
                }
            }
        });
    }
    getSubscriber(topic) {
        for (const subscriber of this.subscribers) {
            subscriber.regexp.lastIndex = 0;
            if (subscriber.regexp.test(topic)) {
                return subscriber;
            }
        }
        return null;
    }
    static topicToRegexp(topic) {
        return new RegExp('^' +
            topic
                .replace('$queue/', '')
                .replace(/^\$share\/([A-Za-z0-9]+)\//, '')
                .replace(/([\[\]\?\(\)\\\\$\^\*\.|])/g, '\\$1')
                .replace(/\+/g, '([^/]+)')
                .replace(/\/#$/, '(/.*)?') +
            '$', 'y');
    }
    static matchGroups(str, regex) {
        regex.lastIndex = 0;
        let m = regex.exec(str);
        const matches = [];
        while (m !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach((match, groupIndex) => {
                if (groupIndex !== 0) {
                    matches.push(match);
                }
            });
            m = regex.exec(str);
        }
        return matches;
    }
};
MqttExplorer = MqttExplorer_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(mqtt_constants_1.MQTT_LOGGER_PROVIDER)),
    __param(3, (0, common_1.Inject)(mqtt_constants_1.MQTT_CLIENT_INSTANCE)),
    __param(4, (0, common_1.Inject)(mqtt_constants_1.MQTT_OPTION_PROVIDER)),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.MetadataScanner,
        common_1.Logger,
        mqtt_1.Client, Object])
], MqttExplorer);
exports.MqttExplorer = MqttExplorer;
//# sourceMappingURL=mqtt.explorer.js.map