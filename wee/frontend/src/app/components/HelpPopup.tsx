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
    <div className="flex justify-between bg-jungleGreen-200 border border-jungleGreen-500 rounded-2xl p-2 hover:cursor-pointer">
      <h3 className=" font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100">
        {message}
      </h3>
      <h3 className=" font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100">
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
                
              </ModalBody>
         
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
