/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService {
  private readonly pubsub: PubSub;

  constructor() {
    this.pubsub = new PubSub({
      projectId: 'alien-grove-429815-s9',
      keyFilename: process.env.GOOGLE_CLOUD_CREDENTIALS,
    });
  }

  async subscribe(subscriptionName: string, messageHandler: (message: any) => void) {
    console.log(`Subscribing to topic: ${subscriptionName}`);
    const subscription = this.pubsub.subscription(subscriptionName);
    subscription.on('message', messageHandler);
  }
}
