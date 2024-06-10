'use client';
import React from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';

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
    );
}