"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Params = exports.Payload = exports.Packet = exports.Topic = exports.Subscribe = void 0;
const common_1 = require("@nestjs/common");
const mqtt_constants_1 = require("./mqtt.constants");
function Subscribe(topicOrOptions) {
    if (typeof topicOrOptions === 'string' || Array.isArray(topicOrOptions)) {
        return (0, common_1.SetMetadata)(mqtt_constants_1.MQTT_SUBSCRIBE_OPTIONS, {
            topic: topicOrOptions,
        });
    }
    else {
        return (0, common_1.SetMetadata)(mqtt_constants_1.MQTT_SUBSCRIBE_OPTIONS, topicOrOptions);
    }
}
exports.Subscribe = Subscribe;
function SetParameter(parameter) {
    return (target, propertyKey, paramIndex) => {
        const params = Reflect.getMetadata(mqtt_constants_1.MQTT_SUBSCRIBER_PARAMS, target[propertyKey]) || [];
        params.push(Object.assign({ index: paramIndex }, parameter));
        Reflect.defineMetadata(mqtt_constants_1.MQTT_SUBSCRIBER_PARAMS, params, target[propertyKey]);
    };
}
function Topic() {
    return SetParameter({
        type: 'topic',
    });
}
exports.Topic = Topic;
function Packet() {
    return SetParameter({
        type: 'packet',
    });
}
exports.Packet = Packet;
function Payload(transform) {
    return SetParameter({
        type: 'payload',
        transform,
    });
}
exports.Payload = Payload;
function Params() {
    return SetParameter({
        type: 'params',
    });
}
exports.Params = Params;
//# sourceMappingURL=mqtt.decorator.js.map