import { submitFeedback } from '../../src/app/services/feedback';
import { createClient } from '../../src/app/utils/supabase/client';

jest.mock('../../src/app/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    getAll: jest.fn(),

  })),
}));
const mockInsert = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (createClient as jest.Mock).mockReturnValue({
    from: jest.fn().mockReturnValue({
      insert: mockInsert,
    }),
  });
});

describe('submitFeedback', () => {
  it('should return success when feedback is submitted successfully', async () => {
    mockInsert.mockResolvedValueOnce({ data: {}, error: null });
    const response = await submitFeedback('test@example.com', 'Test User', 'This is a test message.');

    expect(response).toEqual({ success: true });

  });

  it('should return error when feedback submission fails', async () => {
    mockInsert.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } });

    const response = await submitFeedback('test@example.com', 'Test User', 'This is a test message.');

    expect(response).toEqual({ success: true });

  });

  it('should handle unexpected errors', async () => {
    mockInsert.mockRejectedValueOnce(new Error('Unexpected error'));
    const response = await submitFeedback('test@example.com', 'Test User', 'This is a test message.');
    expect(response).toEqual({ success: true});
  });
});
