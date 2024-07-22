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

  async publishMessage(topicName: string, data: any): Promise<string> {
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const messageId = await (this.pubsub.topic(topicName)).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
    return messageId;
  }

  async subscribe(subscriptionName: string, messageHandler: (message: any) => void): Promise<void> {
    const subscription = this.pubsub.subscription(subscriptionName);
    subscription.on('message', messageHandler);
    subscription.on('error', (error) => {
      console.error(`Received error:`, error);
    });
  }
}