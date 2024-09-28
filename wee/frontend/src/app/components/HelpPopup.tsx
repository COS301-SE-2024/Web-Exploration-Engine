/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@nextui-org/modal';

import { Button } from '@nextui-org/button';
const CardLink: React.FC<{ message: string; link: string }> = ({
  message,
  link,
}) => {
  return (
    <a href={link} target="_blank">
      <div className="flex justify-between bg-jungleGreen-200 dark:bg-jungleGreen-700 border border-jungleGreen-500 hover:bg-jungleGreen-400 hover:dark:bg-jungleGreen-800 rounded-2xl p-2 hover:cursor-pointer duration-500">
        <h3 className="font-poppins text-md">{message}</h3>
        <h3 className="font-poppins-semibold text-xl">↗</h3>
      </div>
    </a>
  );
};

const VideoThumbnail: React.FC<{
  message: string;
  link: string;
  thumbnail: string;
}> = ({ message, link, thumbnail }) => {
  return (
    <a href={link} target="_blank">
      <img
        className="border hover:opacity-90 border-jungleGreen-500 mr-3 rounded-xl "
        src={thumbnail}
        alt="scraping video thumbnail"
      />
    </a>
  );
};

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-2">
      <Button
        onPress={onOpen}
        isIconOnly
        data-testid="help-button"
        className="rounded-full p-0 help-popup-button"
        style={{ bottom: '16px', right: '16px' }}
      >
        <p className="text-2xl">?</p>
      </Button>

      <Modal
        size={'sm'}
        isOpen={isOpen}
        backdrop="transparent"
        data-testid="help-modal"
        onOpenChange={onOpenChange}
        className="my-0 md:help-popup border-2 border-jungleGreen-600 bg-primaryBackgroundColor dark:bg-dark-primaryBackgroundColor"
      >
        <ModalContent className="">
          {(onClose) => (
            <>
              <h1 className="mt-4 text-center font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                Help
              </h1>

              <ModalBody className="px-3">
                <h3 className="py-1 text-center font-poppins-semibold text-xl text-jungleGreen-700 dark:text-jungleGreen-100">
                  FAQs
                </h3>

                <CardLink message="What is a webscraper?" link="/help" />
                <CardLink
                  message="What formats can I export the data in?"
                  link="/help"
                />
                <CardLink
                  message="See all frequently asked questions"
                  link="/help"
                />

                <h3 className="py-1 text-center font-poppins-semibold text-xl text-jungleGreen-700 dark:text-jungleGreen-100">
                  Tutorials
                </h3>

                <div className="flex justify-left gap-2">
                  <VideoThumbnail
                    message="How to start scraping?"
                    thumbnail="images/StartScraping.svg"
                    link="https://drive.google.com/file/d/1RHAZqJYLDp0QfoVW2yWjtgSLnJFsL6Zh/view?usp=sharing"
                  />
                  <VideoThumbnail
                    message="Radar graphs explained"
                    thumbnail="images/RadarGraphs.svg"
                    link="https://drive.google.com/file/d/19HNm1MmcB3hELx9XXwLlc4LX5dzDJr9M/view?usp=sharing"
                  />
                </div>

                <a href={'/help#feedback'} target="_blank">
                  <div className="mb-2 flex justify-between bg-jungleGreen-200 dark:bg-jungleGreen-800 hover:dark:bg-jungleGreen-800 border border-jungleGreen-500 hover:bg-jungleGreen-400 duration-500 rounded-2xl p-4 hover:cursor-pointer">
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
