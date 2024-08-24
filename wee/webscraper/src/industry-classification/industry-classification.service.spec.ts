import { IndustryClassificationService } from './industry-classification.service';
import axios from 'axios';
import { Metadata } from '../models/ServiceModels';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IndustryClassificationService', () => {
  let service: IndustryClassificationService;

  beforeEach(() => {
    service = new IndustryClassificationService();
    process.env.ACCESS_TOKEN = 'test-token'; // Mocking environment variable
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('classifyIndustry', () => {
    it('should return classified industry information', async () => {
      const metadata: Metadata = {
        title: 'Test Title',
        description: 'Test Description',
        keywords: 'Test Keywords',
        ogTitle: 'Test OG Title',
        ogDescription: 'Test OG Description',
        ogImage: 'http://test.com/image.png',
      };
      const url = 'http://test.com';


      // mock number of batches
      jest.spyOn(service, 'createLabelBatches').mockReturnValue([
        ['Technology', 'Finance', 'Healthcare', 'Web', 'Retail', 'Health']
      ]);

      // Mocking axios response for both metadata and domain classification
      mockedAxios.post
        .mockResolvedValueOnce({
          data: {
            labels: ["Technology", "Finance", "Healthcare"],
            scores: [0.9, 0.8, 0.7]
          }
        })
        .mockResolvedValueOnce({
          data: {
            labels: ["Web", "Retail", "Health"],
            scores: [0.8, 0.7, 0.6]
          }
        });
      
      const result = await service.classifyIndustry(url, metadata);
      console.log('Result:', result);

      expect(result).toEqual({
        // metadataClass: { label: 'Technology', score: 0.9 },
        // domainClass: { label: 'Web', score: 0.8 },
        zeroShotMetaDataClassify: [
          { label: 'Technology', score: 0.9 },
          { label: 'Finance', score: 0.8 },
          { label: 'Healthcare', score: 0.7 }
        ],
        zeroShotDomainClassify: [
          { label: 'Web', score: 0.8 },
          { label: 'Retail', score: 0.7 },
          { label: 'Health', score: 0.6 }
        ]
      });
    });

    it('should handle errors gracefully', async () => {
      const metadata: Metadata = {
        title: 'Test Title',
        description: 'Test Description',
        keywords: 'Test Keywords',
        ogTitle: 'Test OG Title',
        ogDescription: 'Test OG Description',
        ogImage: 'http://test.com/image.png',
      };
      const url = 'http://test.com';

      // Mocking axios to throw an error
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const result = await service.classifyIndustry(url, metadata);

      expect(result).toEqual({
        // metadataClass: { label: 'Unknown', score: 0 },
        // domainClass: { label: 'Unknown', score: 0 },
        zeroShotMetaDataClassify: [
          { label: 'Unknown', score: 0 },
          { label: 'Unknown', score: 0 },
          { label: 'Unknown', score: 0 }
        ],
        zeroShotDomainClassify: [
          { label: 'Unknown', score: 0 },
          { label: 'Unknown', score: 0 },
          { label: 'Unknown', score: 0 }
        ]
      });
    });
  });

  // describe('metadataClassify', () => {
  //   it('should return classified metadata', async () => {
  //     const metadata: Metadata = {
  //       title: 'Test Title',
  //       description: 'Test Description',
  //       keywords: 'Test Keywords',
  //       ogTitle: 'Test OG Title',
  //       ogDescription: 'Test OG Description',
  //       ogImage: 'http://test.com/image.png',
  //     };

  //     // Mocking axios response
  //     mockedAxios.post.mockResolvedValue({
  //       data: [[{ label: 'Technology', score: 0.9 }]],
  //     });

  //     const result = await service.metadataClassify(metadata);

  //     expect(result).toEqual({ label: 'Technology', score: 0.9 });
  //   });

  //   it('should handle errors gracefully', async () => {
  //     const metadata: Metadata = {
  //       title: 'Test Title',
  //       description: 'Test Description',
  //       keywords: 'Test Keywords',
  //       ogTitle: 'Test OG Title',
  //       ogDescription: 'Test OG Description',
  //       ogImage: 'http://test.com/image.png',
  //     };

  //     // Mocking axios to throw an error
  //     mockedAxios.post.mockRejectedValue(new Error('Network error'));

  //     await expect(service.metadataClassify(metadata)).rejects.toThrow('Error classifying industry: Network error');
  //   });
  // });

  // describe('domainClassify', () => {
  //   it('should return classified domain', async () => {
  //     const url = 'http://test.com';

  //     // Mocking axios response
  //     mockedAxios.post.mockResolvedValue({
  //       data: [[{ label: 'Web', score: 0.8 }]],
  //     });

  //     const result = await service.domainClassify(url);

  //     expect(result).toEqual({ label: 'Web', score: 0.8 });
  //   });

  //   it('should handle errors gracefully', async () => {
  //     const url = 'http://test.com';

  //     // Mocking axios to throw an error
  //     mockedAxios.post.mockRejectedValue(new Error('Network error'));

  //     await expect(service.domainClassify(url)).rejects.toThrow('Error classifying industry: Network error');
  //   });
  // });

  describe('zeroShotMetaDataClassify', () => {
    it('should return zero-shot classified metadata', async () => {
      const metadata: Metadata = {
        title: 'Test Title',
        description: 'Test Description',
        keywords: 'Test Keywords',
        ogTitle: 'Test OG Title',
        ogDescription: 'Test OG Description',
        ogImage: 'http://test.com/image.png',
      };

      jest.spyOn(service, 'createLabelBatches').mockReturnValue([
        ['Technology', 'Finance', 'Education'],
      ]);
  
      // Mocking axios response
      mockedAxios.post.mockResolvedValue({
        data: {
          labels: ['Technology', 'Finance', 'Education'],
          scores: [0.9, 0.8, 0.7],
        },
      });
  
      const result = await service.zeroShotMetaDataClassify(metadata);
  
      expect(result).toEqual([
        { label: 'Technology', score: 0.9 },
        { label: 'Finance', score: 0.8 },
        { label: 'Education', score: 0.7 },
      ]);
    });
  

    it('should handle errors gracefully', async () => {
      const metadata: Metadata = {
        title: 'Test Title',
        description: 'Test Description',
        keywords: 'Test Keywords',
        ogTitle: 'Test OG Title',
        ogDescription: 'Test OG Description',
        ogImage: 'http://test.com/image.png',
      };

      // Mocking axios to throw an error
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(service.zeroShotMetaDataClassify(metadata)).rejects.toThrow('Error classifying industry: Network error');
    });
  });

  describe('zeroShotDomainClassify', () => {
    it('should return zero-shot classified domain', async () => {
      const url = 'http://test.com';

      jest.spyOn(service, 'createLabelBatches').mockReturnValue([
        ['Web', 'Retail', 'Health'],
      ]);

      // Mocking axios response
      mockedAxios.post.mockResolvedValue({
        data: {
          labels: ['Web', 'Retail', 'Health'],
          scores: [0.8, 0.7, 0.6],
        },
      });

      const result = await service.zeroShotDomainClassify(url);

      expect(result).toEqual([
        { label: 'Web', score: 0.8 },
        { label: 'Retail', score: 0.7 },
        { label: 'Health', score: 0.6 }
      ]);
    });

    it('should handle errors gracefully', async () => {
      const url = 'http://test.com';

      // Mocking axios to throw an error
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(service.zeroShotDomainClassify(url)).rejects.toThrow('Error classifying domain: Network error');
    });
  });
  
  describe('createLabelBatches', () => {
    it('should create batches of labels with the specified batch size', () => {
      const labels = ['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7'];
      const batchSize = 3;

      const result = service.createLabelBatches(labels, batchSize);

      expect(result).toEqual([
        ['label1', 'label2', 'label3'],
        ['label4', 'label5', 'label6'],
        ['label7']
      ]);
    });

    it('should handle an empty array of labels', () => {
      const labels: string[] = [];
      const batchSize = 3;

      const result = service.createLabelBatches(labels, batchSize);

      expect(result).toEqual([]);
    });

    it('should handle a batch size larger than the number of labels', () => {
      const labels = ['label1', 'label2'];
      const batchSize = 5;

      const result = service.createLabelBatches(labels, batchSize);

      expect(result).toEqual([
        ['label1', 'label2']
      ]);
    });
  });
});
