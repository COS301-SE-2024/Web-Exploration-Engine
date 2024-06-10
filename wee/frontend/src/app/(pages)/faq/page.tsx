'use client';
import React, { useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';

const faqs = [
  {
    question: 'What is web scraping?',
    answer: 'Web scraping is the process of extracting data from websites.',
  },
  {
    question: 'Is web scraping legal?',
    answer:
      "Web scraping is legal as long as it is done within the boundaries of the law and respects the website's terms of service.",
  },
  {
    question: 'How does WEE ensure data accuracy?',
    answer:
      'WEE employs advanced algorithms and natural language processing techniques to ensure the extracted data is accurate and reliable.',
  },
  {
    question: 'Can WEE handle large-scale scraping projects?',
    answer:
      'Yes, WEE is designed to handle projects of any scale, providing efficient and scalable data extraction solutions.',
  },
  {
    question: 'Is there a limit to the number of websites WEE can scrape?',
    answer:
      'No, WEE can scrape an unlimited number of websites, depending on the requirements of the project.',
  },
  {
    question: 'How does WEE protect user data?',
    answer:
      'WEE uses robust security measures, including encryption and secure servers, to protect user data and ensure privacy.',
  },
  {
    question: 'What types of reports can WEE generate?',
    answer:
      'WEE can generate a variety of reports, including summaries, detailed analytics, and custom insights based on the extracted data.',
  },
  {
    question: 'Does WEE require any technical expertise to use?',
    answer:
      'No, WEE is designed to be user-friendly and intuitive, making it accessible to users without technical expertise.',
  },
  {
    question: 'Can WEE extract data from dynamic websites?',
    answer:
      'Yes, WEE is equipped to handle dynamic websites and can extract data from sites that use JavaScript and AJAX.',
  },
];

export default function Faq() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, name, message);

    //Ensure Fields Are Filled In
    if (!email || !name || !message) {
      setError('All fields are required');
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    //Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Validate Message
    if (message.length<2) {
      setError('Message is too short');
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Create Request Object

    
  };

  return (
    <div className="">
      <div className="my-16 text-center">
        <h1 className="my-4  mx-9 font-poppins-bold text-5xl md:text-6xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
          Frequently Asked Questions
        </h1>
        <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
          How can we help you?{' '}
        </h3>
      </div>

      <div className="mx-auto px-10 md:px-32 lg:px-48 align-middle ">
        <Accordion className="mx-auto ">
          {faqs.map((faq, index) => (
            <AccordionItem
              className=""
              key={index}
              aria-label={`Accordion ${index + 1}`}
              title={faq.question}
            >
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div id="report"></div>

      <div id="sect-report" className="mx-6">
        <div className="my-16 text-center">
          <h1 className="my-4  mx-9 font-poppins-bold text-5xl md:text-6xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
            Feedback
          </h1>
          <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
            Have a question or an issue you&apos;re experiencing?{' '}
          </h3>
        </div>

        {error ? (
          <span className="mt-4 p-2 mx-4 text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center align-middle">
            <p>{error}</p>
          </span>
        ) : (
          <p className="hidden"></p>
        )}
        <div className="mb-10 flex flex-col justify-center items-center sm:w-4/5 md:w-full lg:w-4/5 mx-auto ">
          <div className="flex w-full flex-wrap md:flex-nowrap gap-1">
            <Input
              className="my-2 md:my-6 mx-3"
              variant="bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              label="Name"
            />
            <Input
              className="my-2 md:my-6 mx-3"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="bordered"
              label="Email"
            />
          </div>
          <div className="w-full grid grid-cols-12 gap-1 px-3">
            <Textarea
              variant="bordered"
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              labelPlacement="inside"
              className="col-span-12 my-2 md:my-6"
            />
          </div>

          <Button
            data-testid="send-message-button"
            onClick={sendMessage}
            className="my-3 font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor w-11/12 lg:w-full"
          >
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
