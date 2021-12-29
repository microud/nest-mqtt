"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransform = exports.TextTransform = exports.JsonTransform = void 0;
const JsonTransform = payload => {
    return JSON.parse(payload.toString('utf-8'));
};
exports.JsonTransform = JsonTransform;
const TextTransform = payload => {
    return payload.toString('utf-8');
};
exports.TextTransform = TextTransform;
function getTransform(transform) {
    if (typeof transform === 'function') {
        return transform;
    }
    else {
        if (transform === 'text') {
            return exports.TextTransform;
        }
        else {
            return exports.JsonTransform;
        }
    }
}
exports.getTransform = getTransform;
//# sourceMappingURL=mqtt.transform.js.map