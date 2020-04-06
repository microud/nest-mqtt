# Nest-MQTT

## Description

A MQTT module for Nest.js. Compatible with emqtt.

## Installation

```bash
$ npm install nest-mqtt
```

## Usage

### Import

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MqttModule } from 'nest-mqtt';

@Module({
  imports: [MqttModule.forRoot(options)]
})
export class AppModule {}
```

### Subscribe

You can define any subscriber or consumer in provider. For example,

```typescript
import { Injectable } from '@nestjs/common';
import { Subscribe } from 'nest-mqtt';

@Injectable()
export class TestService {
  @Subscribe('test')
  test() {
  
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
  test(@Payload payload) {
    console.log(payload);
  }
}
```

### Publish

Nest-mqtt wrap some functions with `Promise` and provide a provider.

## Emqtt Compatible

## Support

Nest-mqtt is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [microud](https://xknow.net)

## License

nest-mqtt is [MIT licensed](LICENSE).
