/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  extractAllowedPaths,
  extractDomain,
  isCrawlingAllowed,
} from '../slogan-app/robot';
import { HttpException, HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch';

jest.mock('node-fetch');

describe('Robot functions', () => {
  describe('extractAllowedPaths', () => {
    it('should extract allowed paths correctly from robots.txt', async () => {
      
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(`
          User-agent: *
          Disallow: /admin
          Allow: /public
        `),
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as any
      );

      const allowedPaths = await extractAllowedPaths('https://example.com');
      expect(allowedPaths.size).toBe(2);
      expect(allowedPaths.has('/')).toBe(true);
      expect(allowedPaths.has('/public')).toBe(true);
    });
    it('should throw error if robots.txt content is empty', async () => {
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(''),
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as any
      );

      await expect(
        extractAllowedPaths('https://example.com')
      ).rejects.toThrowError('robots.txt content is empty');
    });

    it('should add root path if not explicitly disallowed', async () => {
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(`
          User-agent: *
          Disallow: /admin
          Allow: /public
        `),
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as any
      );

      const allowedPaths = await extractAllowedPaths('https://example.com');
      expect(allowedPaths.size).toBe(2); // Including '/'
      expect(allowedPaths.has('/')).toBe(true);
      expect(allowedPaths.has('/public')).toBe(true);
    });

    it('should throw error if fetching robots.txt fails', async () => {
      const mockResponse = {
        ok: false,
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as any
      );

      await expect(
        extractAllowedPaths('https://example.com')
      ).rejects.toThrowError('Failed to fetch robots.txt');
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from valid URL', () => {
      const url = 'https://example.com/path';
      expect(extractDomain(url)).toBe('https://example.com');
    });

    it('should throw error for invalid URL', () => {
      const invalidUrl = 'invalid-url';
      expect(() => extractDomain(invalidUrl)).toThrowError('Invalid URL');
    });
  });

  describe('isCrawlingAllowed', () => {

    it('should not allow crawling for paths not specified in robots.txt', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        throw new Error('Failed to fetch');
      });

      await expect(
        isCrawlingAllowed('https://example.com/private')
      ).rejects.toThrowError(
        new HttpException(
          'Failed to fetch robots.txt for URL: https://example.com/private',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });

    it('should throw HttpException for invalid URL', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error('Invalid URL');
      });

      await expect(isCrawlingAllowed('invalid-url')).rejects.toThrowError(
        'Invalid URL'
      );
    });

    it('should throw HttpException for failed fetch', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(
        isCrawlingAllowed('https://example.com')
      ).rejects.toThrowError('Failed to fetch robots.txt');
    });
  });
});
