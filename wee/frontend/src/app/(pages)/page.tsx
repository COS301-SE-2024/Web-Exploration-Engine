/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { MdErrorOutline } from 'react-icons/md';
import WEETextarea from '../components/Util/Textarea';
import { useScrapingContext } from '../context/ScrapingContext';
import { InfoPopOver } from '../components/InfoPopOver';

// Models
import { ScraperResult, Summary, ErrorResponse } from '../models/ScraperModels';
import { useSearchParams } from 'next/navigation';

function HomeComponent() {
  const {
    setUrls,
    setProcessedUrls,
    setProcessingUrls,
    setResults,
    setSummaryReport,
    setErrorResults,
  } = useScrapingContext();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const MAX_URL_LENGTH = 2048;

  const searchParams = useSearchParams();

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      setUrl(urlParam);
    }
  }, [searchParams]);

  const blacklistedSocialMedia: string[] = [
    // Social Media Sites
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'linkedin.com',
    'snapchat.com',
    'pinterest.com',
    'tiktok.com',
    'reddit.com',
    'youtube.com',
    'whatsapp.com',
    'telegram.com',
    'discord.com',
    'tumblr.com',
    'twitch.tv',
    'vimeo.com',
    'flickr.com',
  ];

  const blacklistedAdult: string[] = [
    // Adult/Inappropriate Sites
    'pornhub.com',
    'xvideos.com',
    'xnxx.com',
    'adultfriendfinder.com',
    'redtube.com',
    'fling.com',
    'onlyfans.com',
    'hentaihaven.com',
  ];

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
  };

  function isUrlSocialMedia(url: string): boolean {
    // Normalize the input URL by converting it to lowercase and removing the protocol
    const normalizedUrl = url.toLowerCase().replace(/(^\w+:|^)\/\//, '');

    // Check if any blacklisted domain is included in the normalized URL
    return blacklistedSocialMedia.some((domain) =>
      normalizedUrl.includes(domain)
    );
  }

  function isUrlInappropriate(url: string): boolean {
    // Normalize the input URL by converting it to lowercase and removing the protocol
    const normalizedUrl = url.toLowerCase().replace(/(^\w+:|^)\/\//, '');

    // Check if any blacklisted domain is included in the normalized URL
    return blacklistedAdult.some((domain) => normalizedUrl.includes(domain));
  }

  const handleScraping = () => {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (!url) {
      setError('URL cannot be empty');

      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    const urlsToScrape = url.split(',').map((u) => u.trim());

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
        setError(
          'URLs cannot contain special characters like <, >, ", \', `, ;, (, or )'
        );

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => clearTimeout(timer);
      }

      if (isUrlSocialMedia(sanitizedURL)) {
        setError('WEE does not support scraping of social media');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => clearTimeout(timer);
      }

      if (isUrlInappropriate(sanitizedURL)) {
        setError(
          'WEE does not support scraping of adult/inappropriate content'
        );

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
          <InfoPopOver
            data-testid="popup-home"
            heading="Start Scraping"
            content="This section provides a brief overview of the website based on the information extracted from the website's metadata. Enter the URLs you wish to scrape below.
              </br></br>
              Please ensure that:
              </br>
              <ul>
                <li>- Up to 10 URLs can be entered.</li>
                <li>- Separate each URL with a comma (,).</li>
                <li>- Include the full URL starting with http:// or https://.</li>
              </ul>
              </br>
              Example: https://example.com, http://anotherexample.com"
            placement="right-end"
          />
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row w-full justify-center items-center">
        <WEETextarea
          data-testid="scraping-textarea-home"
          minRows={1}
          label="URLs to scrape"
          placeholder="Enter the URLs you want to scrape comma separated"
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
          <span className="flex items-center mt-4 text-red-500">
            <MdErrorOutline className="mr-2" />
            {error}
          </span>
        </span>
      ) : (
        <p className="mt-4 p-2 min-h-[3.5rem]"></p>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComponent />
    </Suspense>
  );
}

