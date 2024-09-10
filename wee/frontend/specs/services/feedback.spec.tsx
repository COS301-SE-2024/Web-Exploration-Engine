import { submitFeedback } from '../../src/app/services/feedback';

const mockInsert = jest.fn();

jest.mock('../../src/app/utils/supabase/server', () => ({
  createClient: () => ({
    from: () => ({
      insert: mockInsert,
    }),
  }),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    getAll: jest.fn(),
  })),
}));

describe('submitFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success when feedback is submitted successfully', async () => {
    mockInsert.mockResolvedValueOnce({ data: {}, error: null });
    const response = await submitFeedback('test@example.com', 'Test User', 'This is a test message.');

    expect(response).toEqual({ success: true });
  });

  it('should return error when feedback submission fails', async () => {
    mockInsert.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } });
    const response = await submitFeedback('test@example.com', 'Test User', 'This is a test message.');

    expect(response).toEqual({ success: false, error: 'Database error' });
  });

  it('should handle unexpected errors', async () => {
    mockInsert.mockRejectedValueOnce(new Error('Unexpected error'));
    const response = await submitFeedback('test@example.com', 'Test User', 'This is a test message.');

    expect(response).toEqual({ success: false, error: 'Unexpected error' });
  });
});
