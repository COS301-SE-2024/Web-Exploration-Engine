import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import logger from '../logging/webscraperlogger';
const serviceName = "[PubSubService]";
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
      //console.log(`Message ${messageId} published.`);
      logger.info(serviceName,`Message ${messageId} published.`,messageId);
    } catch (error) {
      //console.error(`Error publishing message: ${error}`);
      logger.info(serviceName,`Error publishing message `,error);
    }
  }
}