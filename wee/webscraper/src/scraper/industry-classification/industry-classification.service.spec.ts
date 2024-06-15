import { IndustryClassificationService } from './industry-classification.service';
import axios from 'axios';
import { Metadata } from '../models/ServiceModels';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IndustryClassificationService', () => {
  let service: IndustryClassificationService;

  beforeEach(() => {
    service = new IndustryClassificationService();
    process.env.access_Token = 'test-token'; // Mocking environment variable
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

      // Mocking axios response for both metadata and domain classification
      mockedAxios.post.mockResolvedValueOnce({
        data: [[{ label: 'Technology', score: 0.9 }]],
      }).mockResolvedValueOnce({
        data: [[{ label: 'Web', score: 0.8 }]],
      });

      const result = await service.classifyIndustry(url, metadata);

      expect(result).toEqual({
        metadataClass: { label: 'Technology', score: 0.9 },
        domainClass: { label: 'Web', score: 0.8 },
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
        metadataClass: { label: 'Unknown', score: 0 },
        domainClass: { label: 'Unknown', score: 0 },
      });
    });
  });

  describe('metadataClassify', () => {
    it('should return classified metadata', async () => {
      const metadata: Metadata = {
        title: 'Test Title',
        description: 'Test Description',
        keywords: 'Test Keywords',
        ogTitle: 'Test OG Title',
        ogDescription: 'Test OG Description',
        ogImage: 'http://test.com/image.png',
      };

      // Mocking axios response
      mockedAxios.post.mockResolvedValue({
        data: [[{ label: 'Technology', score: 0.9 }]],
      });

      const result = await service.metadataClassify(metadata);

      expect(result).toEqual({ label: 'Technology', score: 0.9 });
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

      await expect(service.metadataClassify(metadata)).rejects.toThrow('Error classifying industry: Network error');
    });
  });

  describe('domainClassify', () => {
    it('should return classified domain', async () => {
      const url = 'http://test.com';

      // Mocking axios response
      mockedAxios.post.mockResolvedValue({
        data: [[{ label: 'Web', score: 0.8 }]],
      });

      const result = await service.domainClassify(url);

      expect(result).toEqual({ label: 'Web', score: 0.8 });
    });

    it('should handle errors gracefully', async () => {
      const url = 'http://test.com';

      // Mocking axios to throw an error
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(service.domainClassify(url)).rejects.toThrow('Error classifying industry: Network error');
    });
  });
});