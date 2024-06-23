import { Test, TestingModule } from '@nestjs/testing';
import { RobotsService } from '../robots-app/robots.service';
import { extractAllowedPaths } from '../robots-app/robots';

jest.mock('../robots-app/robots', () => ({
  extractAllowedPaths: jest.fn(),
}));

describe('RobotsService', () => {
  let service: RobotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RobotsService],
    }).compile();

    service = module.get<RobotsService>(RobotsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call extractAllowedPaths with the correct URL', async () => {
    const mockUrl = 'http://example.com';
    const mockPaths = new Set(['/path1', '/path2']);
    (extractAllowedPaths as jest.Mock).mockResolvedValue(mockPaths);

    const result = await service.getAllowedPaths(mockUrl);

    expect(extractAllowedPaths).toHaveBeenCalledWith(mockUrl);
    expect(result).toEqual(mockPaths);
  });

  it('should return an empty set if extractAllowedPaths returns an empty set', async () => {
    const mockUrl = 'http://example.com';
    (extractAllowedPaths as jest.Mock).mockResolvedValue(new Set());

    const result = await service.getAllowedPaths(mockUrl);

    expect(extractAllowedPaths).toHaveBeenCalledWith(mockUrl);
    expect(result).toEqual(new Set());
  });

  it('should handle errors thrown by extractAllowedPaths', async () => {
    const mockUrl = 'http://example.com';
    (extractAllowedPaths as jest.Mock).mockRejectedValue(new Error('Test error'));

    await expect(service.getAllowedPaths(mockUrl)).rejects.toThrow('Test error');
  });

  it('should handle invalid URLs gracefully', async () => {
    const invalidUrl = 'invalid-url';
    (extractAllowedPaths as jest.Mock).mockRejectedValue(new Error('Invalid URL'));

    await expect(service.getAllowedPaths(invalidUrl)).rejects.toThrow('Invalid URL');
  });
});
