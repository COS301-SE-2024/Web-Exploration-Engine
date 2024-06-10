'use client';
import React, { useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';

const faqs = [
  {
    question: 'What is web scraping?',
    answer:
      'Web scraping is the process of extracting data from websites. It is a technique that allows for the gathering of useful information from the internet for various purposes, such as data analysis, market research, and competitive intelligence',
  },
  {
    question: 'Is web scraping legal?',
    answer:
      "Web scraping is legal as long as it is done within the boundaries of the law and respects the website's terms of service.",
  },
  {
    question: 'Can the WEE handle large-scale scraping projects?',
    answer:
      'Yes, the WEE is designed to handle projects of any scale, providing efficient and scalable data extraction solutions.',
  },
  {
    question: 'Is there a limit to the number of websites the WEE can scrape?',
    answer:
      'No, the WEE can scrape an unlimited number of websites, depending on the requirements of the user.',
  },
  {
    question: 'What types of reports can WEE generate?',
    answer:
      'These reports can include summaries, detailed analytics, and custom insights. The specific type of report generated depends on the requirements and preferences of the user.',
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
    if (message.length < 2) {
      setError('Message is too short');
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Create Request Object
  };

  return (
    <main className="">
      <div className="my-16 text-center">
        <h1 className="my-4 mx-9 font-poppins-bold text-5xl md:text-6xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
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
              id={"faq-"+index}
              aria-label={`Accordion ${index + 1}`}
              title={faq.question}
            >
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>

{/*       <div id="tutorials" className="mx-6 h-screen md:px-6 place-content-center">
        <div className="my-16 text-center">
          <h1 className="my-4 font-poppins-bold text-5xl md:text-6xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
            Tutorials
          </h1>
          <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
            Some video guides if you need them.{' '}
          </h3>
        </div>
      </div>
 */}
      <div id="feedback" className="mx-6 h-screen md:px-6 place-content-center">
        <div className="my-16 text-center">
          <h1 className="my-4 font-poppins-bold text-5xl md:text-6xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
            Feedback
          </h1>
          <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
            Have a question or an issue you&apos;re experiencing?{' '}
          </h3>
        </div>

        <div className="mb-10 flex flex-col justify-center items-center sm:w-4/5 md:w-full lg:w-4/5 mx-auto ">
          {error ? (
            <span className="mx-auto mt-4 p-2 w-full text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center align-middle">
              <p>{error}</p>
            </span>
          ) : (
            <p className="hidden"></p>
          )}

          <div className="flex w-full flex-wrap md:flex-nowrap gap-x-2">
            <Input
              className="my-2"
              variant="bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              label="Name"
            />
            <Input
              className="my-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="bordered"
              label="Email"
            />
          </div>
          <div className="w-full grid grid-cols-12 gap-1 ">
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
            className="my-3 font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor w-full"
          >
            Send Message
          </Button>
        </div>
      </div>
    </main>
  );
}
