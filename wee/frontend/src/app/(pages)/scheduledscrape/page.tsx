'use client'
import React from 'react';
import { Button, Modal, ModalHeader, ModalContent, ModalBody, useDisclosure, ModalFooter, SelectItem, DatePicker } from '@nextui-org/react';
import WEEInput from '../../components/Util/Input';
import WEESelect from '../../components/Util/Select';
import { FiPlus } from "react-icons/fi";

export default function ScheduledScrape() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="p-4 min-h-screen">
        <h1 className="my-4 font-poppins-bold text-lg sm:text-xl md:text-2xl text-center text-jungleGreen-800 dark:text-dark-primaryTextColor">
          Scheduled Scraping Tasks
        </h1>
        <div className='flex justify-end'>
          <Button
            data-testid="btn-add-scraping-task"
            startContent={<FiPlus />}
            onPress={onOpen}
            className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 font-poppins-semibold text-md md:text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
          >
            Add Scraping Task
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-jungleGreen-800 dark:text-dark-primaryTextColor">Add Scheduled Scraping Task</ModalHeader>
              <ModalBody>
                <WEEInput
                  type="text"
                  label="Url to scrape"
                  className="sm:w-4/5 md:w-full lg:w-4/5"
                />

                <WEESelect
                  label="Scraping Frequency"
                  data-testid="frequency-select"
                >
                  <SelectItem key='0' textValue='Daily'>Daily</SelectItem>
                  <SelectItem key='1' textValue='Biweekly'>Biweekly</SelectItem>
                  <SelectItem key='2' textValue='Weekly'>Weekly</SelectItem>
                  <SelectItem key='3' textValue='Monthly'>Monthly</SelectItem>
                </WEESelect>

                <DatePicker
                  label="Event Date"
                  variant="bordered"
                  hideTimeZone
                  showMonthAndYearPickers
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className='font-poppins-semibold text-md md:text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor'
                  onPress={onClose}
                >
                  Add Task
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}