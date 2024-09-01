'use client'
import React from 'react';
import { Button, Modal, ModalHeader, ModalContent, ModalBody, useDisclosure, ModalFooter, SelectItem, DatePicker } from '@nextui-org/react';
import WEEInput from '../../components/Util/Input';
import WEESelect from '../../components/Util/Select';
import { FiPlus, FiTrash } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { now, getLocalTimeZone } from "@internationalized/date";

export default function ScheduledScrape() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [keyword, setKeyword] = React.useState('');
  const [keywordList, setKeywordList] = React.useState(['keywordOne', 'keyword phrase two']);
  const [modalError, setModalError] = React.useState('');

  // Add keyword to keyword list
  const handleAddKeyword = () => {
    // show error message if the keyword list exceeds a length of 3
    if (keywordList.length == 3 && keyword.trim() !== '') {
      setModalError("Max of 3 keywords can be tracked");

      const timer = setTimeout(() => {
        setModalError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (keyword.trim() !== '') {
      setKeywordList([...keywordList, keyword.trim()]); // Add the keyword to the list
      setKeyword(''); // Clear the input field
    }
  };

  // Remove keyword from keyword list
  const handleDeleteKeyword = (index: number) => {
    const updatedKeywords = keywordList.filter((_, i) => i !== index);
    setKeywordList(updatedKeywords); // Remove the keyword from the list
  };

  const handleScheduledScrapeTaskAdd = () => {
    alert('Here');
  };

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
                {/* Url to schedule scrape */}
                <WEEInput
                  type="text"
                  label="Url to scrape"
                  className="sm:w-4/5 md:w-full lg:w-4/5"
                />

                {/* Frequency */}
                <WEESelect
                  label="Scraping Frequency"
                  data-testid="frequency-select"
                >
                  <SelectItem key='0' textValue='Daily'>Daily</SelectItem>
                  <SelectItem key='1' textValue='Biweekly'>Biweekly</SelectItem>
                  <SelectItem key='2' textValue='Weekly'>Weekly</SelectItem>
                  <SelectItem key='3' textValue='Monthly'>Monthly</SelectItem>
                </WEESelect>

                {/* Start scraping */}
                <DatePicker
                  label="Start scraping date and time"
                  // variant="bordered"
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={now(getLocalTimeZone())}
                />

                {/* Add keyword or phrase */}
                <div className='flex'>
                  <WEEInput
                    type="text"
                    label="Keyword or phrase"
                    className='pr-2'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <Button
                    isIconOnly
                    onClick={handleAddKeyword}
                    className='my-auto font-poppins-semibold text-md md:text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor'
                  >
                    <FiPlus />
                  </Button>
                </div>

                {/* List of added keywords or phrases */}
                <div>
                  {keywordList.map((kw, index) => (
                    <div key={index} className='flex justify-between'>
                      <span className='hover:cursor-default'>{kw}</span>
                      <span
                        className='my-auto text-red-600 hover:cursor-pointer'
                        onClick={() => handleDeleteKeyword(index)}
                      >
                        <FiTrash />
                      </span>
                    </div>
                  ))}
                </div>

                {modalError ? (
                  <span className="mt-4 mb-2 p-2 text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center align-middle">
                    <MdErrorOutline className="m-auto mx-1" />
                    <p data-testid="keyword-error">{modalError}</p>
                  </span>
                ) : (
                  <></>
                )}

              </ModalBody>
              <ModalFooter>
                <Button
                  className='font-poppins-semibold text-md md:text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor'
                  onPress={onClose}
                  onClick={handleScheduledScrapeTaskAdd}
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