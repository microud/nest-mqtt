import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import {
  MQTT_CLIENT_INSTANCE,
  MQTT_SUBSCRIBE_TOPIC,
  MQTT_SUBSCRIBER_PARAMS,
} from './mqtt.constants';
import { Client } from 'mqtt';
import { Packet } from 'mqtt-packet';
import { getTransform } from './mqtt.transform';
import {
  IMqttSubscriber,
  IMqttSubscriberParameter,
} from './mqtt.interface';

@Injectable()
export class MqttExplorer implements OnModuleInit {
  subscribers: IMqttSubscriber[];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly logger: Logger,
    private readonly reflector: Reflector,
    @Inject(MQTT_CLIENT_INSTANCE) private readonly client: Client,
  ) {
    this.subscribers = [];
  }

  onModuleInit() {
    this.logger.log('MqttModule dependencies initialized');
    this.explore();
  }

  explore() {
    const providers: InstanceWrapper[] = this.discoveryService.getProviders();
    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      if (!instance) {
        return;
      }
      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        key => {
          const topicDetail = this.reflector.get(
            MQTT_SUBSCRIBE_TOPIC,
            instance[key],
          );
          const parameters = this.reflector.get(
            MQTT_SUBSCRIBER_PARAMS,
            instance[key],
          );
          if (topicDetail) {
            this.client.subscribe(topicDetail.topic, err => {
              if (!err) {
                const topic =
                  topicDetail.topic.indexOf('$queue') === 0
                    ? topicDetail.topic.substr(7)
                    : topicDetail.topic;
                this.subscribers.push({
                  topic,
                  regexp: MqttExplorer.topicToRegexp(topic),
                  handle: instance[key],
                  metadata: topicDetail,
                  parameters,
                });
              } else {
                this.logger.error(
                  `subscribe topic [${topicDetail.topic} failed]`,
                );
              }
            });
          }
        },
      );
    });
    this.client.on(
      'message',
      (topic: string, payload: Buffer, packet: Packet) => {
        const subscriber = this.getSubscriber(topic);
        if (subscriber) {
          const parameters = subscriber.parameters.sort(
            (a, b) => a.index - b.index,
          );
          const scatterParameters: IMqttSubscriberParameter[] = [];
          for (const parameter of parameters) {
            scatterParameters[parameter.index] = parameter;
          }
          const transform = getTransform(subscriber.metadata.transform);
          subscriber.handle(
            ...scatterParameters.map(parameter => {
              switch (parameter?.type) {
                case 'payload':
                  return transform(payload);
                case 'topic':
                  return topic;
                case 'packet':
                  return packet;
                case 'params':
                  return MqttExplorer.matchGroups(topic, subscriber.regexp);
                default:
                  return null;
              }
            }),
          );
        }
      },
    );
  }

  private getSubscriber(topic: string): IMqttSubscriber | null {
    for (const subscriber of this.subscribers) {
      if (subscriber.regexp.test(topic)) {
        return subscriber;
      }
    }
    return null;
  }

  private static topicToRegexp(topic: string) {
    // emqtt兼容，共享订阅
    return new RegExp(
      '^' +
        topic
          .replace('$queue/', '')
          .replace(/^\$share\/([A-Za-z0-9]+)\//, '')
          .replace(/([\[\]\?\(\)\\\\$\^\*\.|])/g, '\\$1')
          .replace(/\+/g, '([^/]+)')
          .replace(/\/#$/, '(/.*)?') +
        '$',
      'y',
    );
  }

  private static matchGroups(str: string, regex: RegExp) {
    regex.lastIndex = 0;
    let m;
    const matches: string[] = [];

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        if (groupIndex === 1) {
          matches.push(match);
        }
      });
    }
    return matches;
  }
}
