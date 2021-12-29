/// <reference types="node" />
import { Client, Packet, IClientPublishOptions, IClientSubscribeOptions, ISubscriptionGrant } from 'mqtt';
export declare class MqttService {
    private readonly client;
    constructor(client: Client);
    subscribe(topic: string | string[], opts?: IClientSubscribeOptions): Promise<ISubscriptionGrant[]>;
    unsubscribe(topic: string, opts?: Record<string, any>): Promise<Packet>;
    publish(topic: string, message: string | Buffer | object, opts?: IClientPublishOptions): Promise<Packet>;
}
