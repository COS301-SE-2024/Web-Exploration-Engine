import { Test, TestingModule } from '@nestjs/testing';
import { PubSubService } from './pub_sub.service';
import { PubSub } from '@google-cloud/pubsub';

jest.mock('@google-cloud/pubsub', () => {
  const mPubSub = {
    topic: jest.fn().mockReturnThis(),
    publishMessage: jest.fn(),
    subscription: jest.fn().mockReturnThis(),
    on: jest.fn(),
  };
  return {
    PubSub: jest.fn(() => mPubSub),
  };
});

describe('PubSubService', () => {
  let service: PubSubService;
  let pubsub: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PubSubService],
    }).compile();

    service = module.get<PubSubService>(PubSubService);
    pubsub = new PubSub();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publishMessage', () => {
    it('should publish a message successfully', async () => {
      const topicName = 'test-topic';
      const data = { key: 'value' };
      const messageId = '123';

      pubsub.publishMessage.mockResolvedValue(messageId);

      await service.publishMessage(topicName, data);

      expect(pubsub.topic).toHaveBeenCalledWith(topicName);
      expect(pubsub.publishMessage).toHaveBeenCalledWith({
        data: Buffer.from(JSON.stringify(data)),
      });
    });

    it('should handle errors when publishing a message', async () => {
      const topicName = 'test-topic';
      const data = { key: 'value' };
      const error = new Error('publish error');

      pubsub.publishMessage.mockRejectedValue(error);

      await service.publishMessage(topicName, data);

      expect(pubsub.topic).toHaveBeenCalledWith(topicName);
      expect(pubsub.publishMessage).toHaveBeenCalledWith({
        data: Buffer.from(JSON.stringify(data)),
      });
    });
  });

  describe('subscribe', () => {
    it('should subscribe to a topic successfully', async () => {
      const subscriptionName = 'test-subscription';
      const messageHandler = jest.fn();

      await service.subscribe(subscriptionName, messageHandler);

      expect(pubsub.subscription).toHaveBeenCalledWith(subscriptionName);
      expect(pubsub.on).toHaveBeenCalledWith('message', messageHandler);
    });
  });
});
