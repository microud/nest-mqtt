import { Injectable } from '@nestjs/common';
import { Subscribe, Payload, Topic } from '../src';

@Injectable()
export class TestService {
  @Subscribe('test')
  test(@Payload() payload) {
    console.log(payload);
  }

  @Subscribe({
    topic: 'test2',
    transform: payload => payload.toString(),
  })
  test2(@Payload() payload) {
    console.log(payload);
  }
}
