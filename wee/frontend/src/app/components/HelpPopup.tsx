'use client';
import React from 'react';
import Link from 'next/link';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  RadioGroup,
  Radio,
} from '@nextui-org/react';


const CardLink: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex justify-between bg-jungleGreen-200 dark:bg-jungleGreen-700 border border-jungleGreen-500 hover:bg-jungleGreen-200 hover:text-white dark:hover:text-jungleGreen-950 rounded-2xl p-2 hover:cursor-pointer dark:">
      <h3 className=" font-poppins text-md">
        {message}
      </h3>
      <h3 className=" font-poppins-semibold text-xl">
        ↗
      </h3>

    </div>
  );
};


export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex help-popup flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit">
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        placement={'bottom'}
        backdrop="transparent"
        onOpenChange={onOpenChange}
        className="border-2 border-jungleGreen-600 bg-white"
      >
        <ModalContent className="">
          {(onClose) => (
            <>
              <h1 className="my-4 text-center font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                Help
              </h1>

              <ModalBody className="px-3">
                <h3 className="py-3 font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                  FAQs
                </h3>
                <Link href={"/faq"}>
                <CardLink message="What is a webscraper?" />
                </Link>
                <CardLink message="What formats can I export the scraped data?"/>
                <CardLink message="What is a webscraper?"/>
                
                <h3 className="py-3 font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                  Tutorials
                </h3>
            
                <div className="flex justify-between bg-jungleGreen-200 border border-jungleGreen-500 rounded-2xl p-4 hover:cursor-pointer">
                  <h3 className=" font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                    Provide Feedback
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="jungleGreen-200"
                    className="border border-jungleGreen-200"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"
                    />
                  </svg>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
