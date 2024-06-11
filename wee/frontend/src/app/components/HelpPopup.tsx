'use client';
import React from 'react';
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
          {/*     <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
              </ModalBody>
            {/*   <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
