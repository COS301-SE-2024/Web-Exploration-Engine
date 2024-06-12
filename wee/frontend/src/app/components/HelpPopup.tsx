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
      <h3 className=" font-poppins text-md">{message}</h3>
      <h3 className="font-poppins-semibold text-xl">↗</h3>
    </div>
  );
};

const VideoThumbnail: React.FC<{ message: string; link: string }> = ({
const CardLink: React.FC<{ message: string; link: string }> = ({
  message,
  link,
}) => {
  return (
        <h3 className="font-poppins-semibold text-xl">↗</h3>
      </div>{' '}
    </a>
  );
};

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex help-popup flex-col gap-2">
      <Button onPress={onOpen} size="sm" className="w-2 rounded-full px-0">
        ?
      </Button>

      <Modal
        isOpen={isOpen}
        backdrop="transparent"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="">
          {(onClose) => (
            <>
              <h1 className="mt-4 text-center font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                Help
              </h1>

              <ModalBody className="px-3">
                <h3 className="py-1 font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                  FAQs
                </h3>

                <CardLink message="What is a webscraper?" link="/faq" />
                <CardLink
                  message="What formats can I export the data in?"
                  link="/faq"
                />
                <CardLink
                  message="See all frequently asked questions"
                  link="/faq"
                />

                <h3 className="py-1 font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                  Tutorials
                </h3>

                <div className="flex justify-left gap-2">
                  <VideoThumbnail
                    message="What formats can I export the scraped data?"
                    thumbnail="https://mir-s3-cdn-cf.behance.net/project_modules/fs/8550b8190548687.6669b4f198c2f.png"
                    link="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs"
                  />
                  <VideoThumbnail
                    message="How to scrape multiple reports?"
                    thumbnail="https://mir-s3-cdn-cf.behance.net/project_modules/fs/4e6daa190548687.6669b4f199391.png"
                    link="https://www.youtube.com/watch?v=ZKcuvdnVF80&pp=ygURYSBiaXJkcyBsYXN0IGxvb2s%3D"
                  />
                </div>

                <a href={'/faq#contact'} target="_blank">
                  <div className="mb-2 flex justify-between bg-jungleGreen-200 dark:bg-jungleGreen-600 hover:dark:bg-jungleGreen-800 border border-jungleGreen-500 hover:bg-jungleGreen-400 duration-500 rounded-2xl p-4 hover:cursor-pointer">
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                      Provide Feedback
                    </h3>
                    <h3 className="font-poppins-semibold text-xl">↗</h3>
                  </div>
                </a>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}