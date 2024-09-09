// submitFeedback.test.ts
import { submitFeedback } from '../../src/app/services/feedback';
import { createClient } from '../../src/app/utils/supabase/client';

// Mock the Supabase client
jest.mock('../../src/app/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    getAll: jest.fn(),
    // Mock other methods if needed
  })),
}));
const mockInsert = jest.fn();

beforeEach(() => {
  // Reset the mock before each test
  jest.clearAllMocks();

  // Mock the Supabase client behavior
  (createClient as jest.Mock).mockReturnValue({
    from: jest.fn().mockReturnValue({
      insert: mockInsert,
    }),
  });
});

describe('submitFeedback', () => {
  it('should return success when feedback is submitted successfully', async () => {
    // Arrange
    mockInsert.mockResolvedValueOnce({ data: {}, error: null });

    // Act
    const response = await submitFeedback('test@example.com', 'Test User', 'This is a test message.');

    // Assert
    expect(response).toEqual({ success: true });
 
  });

  // it('should return error when feedback submission fails', async () => {
  //   // Arrange
  //   mockInsert.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } });

  //   // Act
  //   const response = await submitFeedback('test@example.com', 'Test User', 'This is a test message.');

  //   // Assert
  //   expect(response).toEqual({ success: false, error: 'Database error' });
  // });

  // it('should handle unexpected errors', async () => {
  //   // Arrange
  //   mockInsert.mockRejectedValueOnce(new Error('Unexpected error'));

  //   // Act
  //   const response = await submitFeedback('test@example.com', 'Test User', 'This is a test message.');

  //   // Assert
  //   expect(response).toEqual({ success: false, error: 'Unexpected error' });
  // });
});
