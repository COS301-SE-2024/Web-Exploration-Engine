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
        placement={'bottom'}
        backdrop="transparent"
        onOpenChange={onOpenChange}
        className="border-2 border-jungleGreen-600 bg-primaryBackgroundColor dark:bg-dark-primaryBackgroundColor"
      >
        <ModalContent className="">
          {(onClose) => (
            <>
              <h1 className="my-4 text-center font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                Help
              </h1>

              <ModalBody className="px-3">
                <h3 className="py-1 font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                  FAQs
                </h3>
                <Link href={'/faq'}>
                  <CardLink message="What is a webscraper?" />
                </Link>
                <CardLink message="What formats can I export the data in?" />
                <CardLink message="See all frequently asked questions" />

                <h3 className="py-1 font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                  Tutorials
                </h3>

                <div>
                  <VideoThumbnail
                    message="What formats can I export the scraped data?"
                    link="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs"
                  />
                  <VideoThumbnail
                    message="What is a webscraper?"
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
