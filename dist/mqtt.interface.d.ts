/// <reference types="node" />
import { IClientOptions, Packet } from 'mqtt';
import { LoggerService, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
export declare type MqttMessageTransformer = (payload: Buffer) => any;
export declare type LoggerConstructor = new (...params: any[]) => LoggerService;
export interface MqttSubscribeOptions {
    topic: string | string[];
    queue?: boolean;
    share?: string;
    transform?: 'json' | 'text' | MqttMessageTransformer;
}
export interface MqttSubscriberParameter {
    index: number;
    type: 'payload' | 'topic' | 'packet' | 'params';
    transform?: 'json' | 'text' | MqttMessageTransformer;
}
export interface MqttSubscriber {
    topic: string;
    handle: any;
    route: string;
    provider: any;
    regexp: RegExp;
    options: MqttSubscribeOptions;
    parameters: MqttSubscriberParameter[];
}
export interface MqttLoggerOptions {
    useValue?: LoggerService;
    useClass?: Type<LoggerService>;
}
export interface MqttModuleOptions extends IClientOptions {
    queue?: boolean;
    share?: string;
    logger?: MqttLoggerOptions;
    beforeHandle?: (topic: string, payload: Buffer, packet: Packet) => any;
}
export interface MqttOptionsFactory {
    createMqttConnectOptions(): Promise<MqttModuleOptions> | MqttModuleOptions;
}
export interface MqttModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useExisting?: Type<MqttOptionsFactory>;
    useClass?: Type<MqttOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<MqttModuleOptions> | MqttModuleOptions;
    logger?: MqttLoggerOptions;
}
