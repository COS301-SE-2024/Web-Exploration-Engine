import { submitFeedback } from '../../src/app/services/feedback';
import { createClient } from '../../src/app/utils/supabase/server';


jest.mock('../../src/app/utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(),
    })),
  })),
}));

const mockInsert = jest.fn();
const supabase = createClient();

describe('submitFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully submit feedback', async () => {
   n
    (supabase.from as jest.Mock).mockReturnValueOnce({
      insert: mockInsert.mockResolvedValueOnce({ data: [], error: null }), // Mock successful insert
    });

    const response = await submitFeedback('test@example.com', 'John Doe', 'Great app!');

    expect(response).toEqual({ success: true });
    expect(mockInsert).toHaveBeenCalledWith([
      {
        email: 'test@example.com',
        name: 'John Doe',
        message: 'Great app!',
        created_at: expect.any(String),
      },
    ]);
    expect(mockInsert).toHaveBeenCalledTimes(1);
  });

  it('should handle errors during feedback submission', async () => {
  
    const errorMessage = 'Database error';
    (supabase.from as jest.Mock).mockReturnValueOnce({
      insert: mockInsert.mockResolvedValueOnce({ data: [], error: null }), // Mock failed insert
    });

    const response = await submitFeedback('test@example.com', 'John Doe', 'Great app!');

    expect(response).toEqual({ success: false, error: errorMessage });
    expect(mockInsert).toHaveBeenCalledWith([
      {
        email: 'test@example.com',
        name: 'John Doe',
        message: 'Great app!',
        created_at: expect.any(String),
      },
    ]);
    expect(mockInsert).toHaveBeenCalledTimes(1);
  });
});
