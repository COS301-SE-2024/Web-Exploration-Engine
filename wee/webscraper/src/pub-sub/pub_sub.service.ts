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

  async publishMessage(topicName: string, data: any) {
    // Convert the data to a Buffer
    const dataBuffer = Buffer.from(JSON.stringify(data));
    try {
      const messageId = await this.pubsub
        .topic(topicName).publishMessage({ data: dataBuffer });
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.error(`Error publishing message: ${error}`);
    }
  }

  async subscribe(subscriptionName: string, messageHandler: (message: any) => void) {
    console.log(`Subscribing to topic: ${subscriptionName}`);
    const subscription = this.pubsub.subscription(subscriptionName);
    subscription.on('message', messageHandler);
  }
}