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
                  Start by entering the URL of the website you wish to scrape
                </h3>
                
              </ModalBody>
         
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
