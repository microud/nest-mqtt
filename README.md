# Nest-MQTT

## Description

A MQTT module for Nest.js. Compatible with emqtt.

## Installation

```bash
$ npm install nest-mqtt
```

## Usage

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MqttModule } from 'nest-mqtt';

@Module({
  imports: [MqttModule.listen(options)]
})
export class AppModule {}
```

## Support

Nest-mqtt is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [microud](https://xknow.net)

## License

nest-mqtt is [MIT licensed](LICENSE).
