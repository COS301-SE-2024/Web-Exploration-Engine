import { submitFeedback } from '../../src/app/services/feedback';
import { createClient } from '../../src/app/utils/supabase/client';


const mockInsert = jest.fn();
const mockSupabaseClient = {
  from: jest.fn().mockReturnValue({
    insert: mockInsert,
  }),
};

jest.mock('../../src/app/utils/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
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
    (mockInsert as jest.Mock).mockResolvedValue({ data: [], error: null });

    const response = await submitFeedback('test@example.com', 'John Doe', 'Great service!');

    expect(response).toEqual({ success: true });
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith([
      {
        email: 'test@example.com',
        name: 'John Doe',
        message: 'Great service!',
        created_at: expect.any(String),
      },
    ]);
  });

  it('should return error when Supabase insert fails', async () => {
    (mockInsert as jest.Mock).mockResolvedValue({ data: [], error: 'Insert failed' });

    const response = await submitFeedback('test@example.com', 'John Doe', 'Great service!');

    expect(response).toEqual({ success: false, error: 'Insert failed' });
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith([
      {
        email: 'test@example.com',
        name: 'John Doe',
        message: 'Great service!',
        created_at: expect.any(String),
      },
    ]);
  });

  it('should handle unexpected errors', async () => {
    (mockInsert as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    const response = await submitFeedback('test@example.com', 'John Doe', 'Great service!');

    expect(response).toEqual({ success: false, error: 'Unexpected error' });
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith([
      {
        email: 'test@example.com',
        name: 'John Doe',
        message: 'Great service!',
        created_at: expect.any(String),
      },
    ]);
  });
});
