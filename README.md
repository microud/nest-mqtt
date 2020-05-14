# Nest-MQTT

## Description

A MQTT module for Nest.js. Compatible with emqtt.

## Installation

```bash
$ npm install nest-mqtt --save
```

## Usage

### Import

Nest-mqtt will register as a global module.

You can import with configuration

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MqttModule } from 'nest-mqtt';

@Module({
  imports: [MqttModule.forRoot(options)]
})
export class AppModule {}
```

or use async import method

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MqttModule } from 'nest-mqtt';

@Module({
  imports: [MqttModule.forRootAsync({
    useFactory: () => options,
  })]
})
export class AppModule {}
```


### Subscribe

You can define any subscriber or consumer in any provider. For example,

```typescript
import { Injectable } from '@nestjs/common';
import { Subscribe, Payload, Topic } from 'nest-mqtt';

@Injectable()
export class TestService {
  @Subscribe('test')
  test() {
  
  }
  
  @Subscribe({
    topic: 'test2',
    transform: payload => payload.toString(),
  })
  test2() {
    
  }
}
```

Also, you can inject parameter with decorator:

```typescript
import { Injectable } from '@nestjs/common';
import { Subscribe, Payload } from 'nest-mqtt';

@Injectable()
export class TestService {
  @Subscribe('test')
  test(@Payload() payload) {
    console.log(payload);
  }
}
```

Here are all supported parameter decorators:

#### Payload(transform?: (payload) => any)

Get the payload data of incoming message. You can pass in a transform function for converting.

#### Topic()

Get the topic of incoming message.

#### Packet()

Get the raw packet of incoming message.

#### Params()

Get the wildcard part of topic. It will return an array of string which extract from topic. For example:

When subscribe the topic "test/+/test/+" and incoming topic is "test/1/test/2", you will get the array `["1", "2"]`. 

### Publish

Nest-mqtt wrap some functions with `Promise` and provide a provider.

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { MqttService } from 'nest-mqtt';

@Injectable()
export class TestService {
  constructor(
    @Inject(MqttService) private readonly mqttService: MqttService,
  ) {}

  async testPublish() {
    this.mqttService.publish('topic', {
      foo: 'bar'
    });
  }

}
```

## Emqtt Compatible

nest-mqtt support emq shared subscription

- Global mode

Module options support queue and share property for globally converting all topic to shared topic except configured in subscription options.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MqttModule } from 'nest-mqtt';

@Module({
  imports: [MqttModule.forRoot({
    host: '127.0.0.1',
    queue: true,
    share: 'group1'
  })]
})
export class AppModule {}
```

- Configure in Subscribe

```typescript
import { Injectable } from '@nestjs/common';
import { Subscribe, Payload, Topic } from 'nest-mqtt';

@Injectable()
export class TestService {
  @Subscribe('test')
  test() {
  
  }
  
  @Subscribe({
    topic: 'test2',
    queue: true,
  })
  test2() {
    
  }
}
```

The priority of subscribe is higher than the global mode. If you want to specify a topic do not use the shared mode, set it as false in subscribe decorator. 

## Support

Nest-mqtt is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [microud](https://xknow.net)

## License

nest-mqtt is [MIT licensed](LICENSE).
