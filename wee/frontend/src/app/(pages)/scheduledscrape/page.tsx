'use client'
import React from 'react';
import { Button, Modal, ModalHeader, ModalContent, ModalBody, useDisclosure, ModalFooter, SelectItem, DatePicker } from '@nextui-org/react';
import WEEInput from '../../components/Util/Input';
import WEESelect from '../../components/Util/Select';
import { FiPlus, FiTrash } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { now, getLocalTimeZone } from "@internationalized/date";

export default function ScheduledScrape() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [urlToAdd, setUrlToAdd] = React.useState('');
  const [scrapingFrequency, setScrapingFrequency] = React.useState<string>('');
  const [scrapeStartDate, setScrapeStartDate] = React.useState(new Date());
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

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (_) {
      return false;
    }
  };

  const sanitizeURL = (url: string) => {
    return url.replace(/[<>"'`;()]/g, '');
  }

  const handleScheduledScrapeTaskAdd = () => {
    let errorMessage = '';

    // error handling for url field
    if (!urlToAdd) {
      errorMessage = "URL cannot be empty";
    }
    else if (urlToAdd !== sanitizeURL(urlToAdd)) {
      errorMessage = 'URLs cannot contain special characters like <, >, ", \', `, ;, (, or )';
    }
    else if (!isValidUrl(urlToAdd)) {
      errorMessage = "Please enter a valid URL";
    }
    else if (!scrapingFrequency) {
      errorMessage = "Please select a scraping frequency";
    }
    else {
      const now = new Date(); 
      if (!scrapeStartDate || new Date(scrapeStartDate) < now) {   
        errorMessage = "The start date and time cannot be in the past";
      }
    }

    // display error message
    if (errorMessage) {
      setModalError(errorMessage);
      const timer = setTimeout(() => {
        setModalError('');
      }, 3000);
      return () => clearTimeout(timer);
    }

    // close the modal once successful
    onClose();
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
                  value={urlToAdd}
                  onChange={(e) => setUrlToAdd(e.target.value)}
                />

                {/* Frequency */}
                <WEESelect
                  label="Scraping Frequency"
                  data-testid="frequency-select"
                  value={scrapingFrequency}
                  onChange={(event) => setScrapingFrequency(event.target.value)}
                >
                  <SelectItem key='0' textValue='Daily'>Daily</SelectItem>
                  <SelectItem key='1' textValue='Biweekly'>Biweekly</SelectItem>
                  <SelectItem key='2' textValue='Weekly'>Weekly</SelectItem>
                  <SelectItem key='3' textValue='Monthly'>Monthly</SelectItem>
                </WEESelect>

                {/* Start scraping */}
                <DatePicker
                  label="Start scraping date and time"
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={now(getLocalTimeZone())}
                  onChange={(value: any) => setScrapeStartDate(value)}
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
                  // onPress={onClose}
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