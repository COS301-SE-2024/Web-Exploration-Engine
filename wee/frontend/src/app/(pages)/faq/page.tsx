'use client';
import React from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
  const defaultContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

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
  // Add more FAQs here
];
export default function Faq() {
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

        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              aria-label={`Accordion ${index + 1}`}
              title={faq.question}
            >
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
        
        <Accordion>
          <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
            {defaultContent}
          </AccordionItem>
        </Accordion>
      </div>
    );
}