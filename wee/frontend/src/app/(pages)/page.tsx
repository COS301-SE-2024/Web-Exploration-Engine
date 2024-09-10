'use client'
import React, { useState } from "react";
import { Button, Checkbox } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { MdErrorOutline } from "react-icons/md";
import WEETextarea from "../components/Util/Textarea";
import { useScrapingContext } from "../context/ScrapingContext";

// Models
import { ScraperResult, Summary, ErrorResponse } from "../models/ScraperModels";


export default function Home() {
    const { setUrls, setProcessedUrls, setProcessingUrls, setResults, setSummaryReport, setErrorResults } = useScrapingContext();
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');     
    const MAX_URL_LENGTH = 2048;   
   
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

    const handleScraping = () => {
      if (!url) {
          setError('URL cannot be empty');

          const timer = setTimeout(() => {
              setError('');
          }, 3000);

          return () => clearTimeout(timer);
      }

      const urlsToScrape = url.split(',').map(u => u.trim());

      if (urlsToScrape.length > 10) {
        setError('Maximum of 10 URLs can be scraped');
  
        const timer = setTimeout(() => {
            setError('');
        }, 3000);

        return () => clearTimeout(timer);
      } 

      for (const singleUrl of urlsToScrape) {
        const sanitizedURL = sanitizeURL(singleUrl);

        if (sanitizedURL !== singleUrl) {
          setError('URLs cannot contain special characters like <, >, ", \', `, ;, (, or )');

          const timer = setTimeout(() => {
              setError('');
          }, 3000);

          return () => clearTimeout(timer);
        }

        if (sanitizedURL.length >= MAX_URL_LENGTH) {
          setError(`URL exceeds maximum length of ${MAX_URL_LENGTH} characters`);

          const timer = setTimeout(() => {
              setError('');
          }, 3000);

          return () => clearTimeout(timer);
        }

        if (!isValidUrl(sanitizedURL)) {
            setError('Please enter valid URLs');

            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
      }
      setError('');

      // set the urls to scrape in the context
      setUrls(urlsToScrape);
      
      // Clear the processing and processed urls
      setProcessedUrls([]);
      setProcessingUrls([]);
      setResults((prevResults: ScraperResult[]) => []);
      setErrorResults((prevResults: ErrorResponse[]) => []);
      setSummaryReport({} as Summary);

      // Navigate to Results page with the entered URL as query parameter
      router.push(`/scraperesults`);
    };

    return (
      <div className="p-4 flex flex-col items-center min-h-screen">
        <div className="mb-4 md:my-8 text-center">
          <h1 className="mt-8 mb-5 font-poppins-bold text-4xl lg:text-5xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
            The Web Exploration Engine
          </h1>
          <h3 className="font-poppins-semibold text-lg md:mx-32 lg:mx-72 text-jungleGreen-700 dark:text-jungleGreen-100">
            Automate the extraction of critical website information and generate
            comprehensive reports from your scraped data.
          </h3>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
            Ready to start scraping?
          </h1>
          <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
            Start by entering the URLs of the websites you wish to scrape
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-center items-center">
          <WEETextarea
            data-testid="scraping-textarea-home"
            minRows={1}
            label="URLs to scrape"
            placeholder="Enter the URLs you want to scrape comma seperated"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            data-testid="btn-start-scraping"
            className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
            onClick={handleScraping}
          >
            Start scraping
          </Button>
        </div>
        {error ? (
          <span className="mt-4 mb-2 p-2 text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center align-middle">
            <MdErrorOutline className="m-auto mx-1" />
            <p>{error}</p>
          </span>
        ) : (
          <p className="mt-4 p-2 min-h-[3.5rem]"></p>
        )}
      </div>
    );
}
