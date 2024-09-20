import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

// Mock the nodemailer module
jest.mock('nodemailer');

describe('EmailService', () => {
  let emailService: EmailService;
  let transporter: jest.Mocked<nodemailer.Transporter>;

  beforeEach(async () => {
    // Clear all instances and calls to constructor and all methods
    jest.clearAllMocks();

    // Mock implementation for createTransport
    transporter = {
      sendMail: jest.fn().mockResolvedValue({}),
    } as any;

    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('sendMail', () => {
    it('should call transporter.sendMail with correct parameters', async () => {
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const text = 'Test Body';

      await emailService.sendMail(to, subject, text);

      expect(transporter.sendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
      });
    });

    it('should log success message when email is sent successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const text = 'Test Body';

      await emailService.sendMail(to, subject, text);

      expect(consoleSpy).toHaveBeenCalledWith('Email sent successfully to:', to);
      consoleSpy.mockRestore();
    });

    it('should log error message when email sending fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      transporter.sendMail.mockRejectedValue(new Error('Send mail failed'));

      const to = 'test@example.com';
      const subject = 'Test Subject';
      const text = 'Test Body';

      await emailService.sendMail(to, subject, text);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});
