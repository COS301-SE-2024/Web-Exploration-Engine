'use client';
import React from "react";
import WEESelect from "../../components/Util/Select";
import { Button, SelectItem } from '@nextui-org/react';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter } from 'next/navigation';
import { ScraperResult } from '../../models/ScraperModels';
import { FiCheck, FiSearch, FiEye, FiSmartphone, FiClock, FiActivity, FiImage, FiBook, FiFacebook, FiBookOpen, FiEdit } from "react-icons/fi";
import CircularProgressComparison from "../../components/CircularProgressComparison";
import { LightHouseAnalysis, SEOError, SiteSpeedAnalysis, MobileFriendlinessAnalysis, ImageAnalysis, UniqueContentAnalysis } from "../../models/ScraperModels";
import { ColumnChart } from "../../components/Graphs/ColumnChart";
import { InfoPopOver } from "../../components/InfoPopOver";
import useBeforeUnload from "../../hooks/useBeforeUnload";
import { DonutChart } from "../../components/Graphs/DonutChart";

function isLightHouse(data: LightHouseAnalysis | SEOError): data is LightHouseAnalysis {
    return 'scores' in data || 'diagnostics' in data;
}

function isSiteSpeedAnalysis(data: SiteSpeedAnalysis | SEOError): data is SiteSpeedAnalysis {
    return 'loadTime' in data || 'recommendations' in data;
}

function isMobileFriendlinessAnalysis(data: MobileFriendlinessAnalysis | SEOError): data is MobileFriendlinessAnalysis {
    return 'isResponsive' in data || 'recommendations' in data;
}

function isImageAnalysis(data: ImageAnalysis | SEOError): data is ImageAnalysis {
    return 'errorUrls' in data || 'missingAltTextCount' in data || 'nonOptimizedCount' in data || 'reasonsMap' in data || 'recommendations' in data || 'totalImages' in data;
}

function isUniqueContentAnalysis(data: UniqueContentAnalysis | SEOError): data is UniqueContentAnalysis {
    return 'recommendations' in data || 'textLength' in data || 'uniqueWordsPercentage' in data || 'repeatedWords' in data;
}

export default function Comparison() {
    const { results } = useScrapingContext();
    const router = useRouter();
    const [websiteOne, setWebsiteOne] = React.useState<ScraperResult>();
    const [websiteTwo, setWebsiteTwo] = React.useState<ScraperResult>();

    useBeforeUnload();

    const backToScrapeResults = () => {
        router.push(`/scraperesults`);
    };

    const handleWebsiteOne = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const website1: number = parseInt(event.target.value, 10);
        setWebsiteOne(results[website1]);
    }

    const handleWebsiteTwo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const website2: number = parseInt(event.target.value, 10);
        setWebsiteTwo(results[website2]);
    }

    return (
        <div className="min-h-screen p-4">
            <Button
                className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                onClick={backToScrapeResults}
                data-testid="btn-back"
            >
                Back
            </Button>
            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Website Comparison
                </h1>
            </div>

            <div className="mb-4">
                <WEESelect
                    label="Website 1"
                    className="w-1/2 pr-3 pb-3"
                    onChange={handleWebsiteOne}
                    data-testid="website1-select"
                >
                    {results.map((item, index) => (
                        <SelectItem key={index} textValue={item.url} data-testid={`website1-option-${index}`}>{item.url}</SelectItem>
                    ))}
                </WEESelect>

                <WEESelect
                    label="Website 2"
                    className="w-1/2 pl-3 pb-3"
                    onChange={handleWebsiteTwo}
                    data-testid="website2-select"
                >
                    {results.map((item, index) => (
                        <SelectItem key={index} textValue={item.url} data-testid={`website2-option-${index}`}>{item.url}</SelectItem>
                    ))}
                </WEESelect>
            </div>

            <div className="bg-jungleGreen-800 dark:bg-jungleGreen-400 text-dark-primaryTextColor dark:text-primaryTextColor rounded-xl flex justify-around p-2 px-3">
                <div className="text-xs my-auto sm:text-lg">
                    {websiteOne ? websiteOne.url : 'Website 1'}
                </div>

                <div className="text-xs my-auto sm:text-lg">
                    {websiteTwo ? websiteTwo.url : 'Website 2'}
                </div>
            </div>

            <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 text-lg text-center mt-3'>
                Domain Overview
                <InfoPopOver
                    data-testid="popup-info-domain-info"
                    heading="Domain Overview"
                    content="This section provides important tags to classify the website based on the extracted information. </br></br>
                        <i>Status</i>: This field indicates if the website is live or parked. A live website is one that is active and accessible to users. A parked website is a domain that is registered but not in use. </br></br>
                        <i>*Industry Classification</i>: This field provides the industry classification of the website based on its metadata. </br>
                        <i>*Domain match</i>: This field provides the domain classification of the website based on the url of the website. </br>
                        <i>*Confidence Score</i>: This field provides the confidence score of the classification. </br></br>
                        <i>Note</i>: The fields marked with an asterisk (*) are generated using zero-shot machine learning models. These models provide a confidence score for each classification."
                    placement="bottom"
                />
            </h4>

            {/* Website Status */}
            <div data-testid="sect-website-status" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Website Status
                </div>
                <div className="flex justify-between ">
                    <div data-testid="website1-status" className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        {!websiteOne ? '-' : (websiteOne.domainStatus === 'live' ? 'Live' : 'Parked')}
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center'>
                            <FiSearch />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Website Status
                        </div>
                    </div>

                    <div data-testid="website2-status" className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        {!websiteTwo ? '-' : (websiteTwo.domainStatus === 'live' ? 'Live' : 'Parked')}
                    </div>
                </div>
            </div>

            {/* Industry Classification */}
            <div data-testid="sect-industry-classification" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Industry Classification
                </div>
                <div className="flex justify-between ">
                    <div className="text-center w-1/3">
                        <div data-testid="website1-meta-score" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {!websiteOne ? '-' : (websiteOne.industryClassification && websiteOne.industryClassification.zeroShotMetaDataClassify[0].score ? (websiteOne.industryClassification.zeroShotMetaDataClassify[0].score * 100).toFixed(2) + '%' : '0%')}
                        </div>
                        <div data-testid="website1-meta-label" className='font-poppins-semibold text-sm sm:text-lg'>
                            {!websiteOne ? '-' : (websiteOne.industryClassification && websiteOne.industryClassification.zeroShotMetaDataClassify[0].label ? websiteOne.industryClassification.zeroShotMetaDataClassify[0].label : 'N/A')}
                        </div>
                        {
                            !websiteOne ? '' : (websiteOne.industryClassification ?
                                <ColumnChart
                                    dataLabel={[
                                        websiteOne.industryClassification.zeroShotMetaDataClassify[1].label,
                                        websiteOne.industryClassification.zeroShotMetaDataClassify[0].label,
                                        websiteOne.industryClassification.zeroShotMetaDataClassify[2].label
                                    ]}
                                    dataSeries={[
                                        (websiteOne.industryClassification.zeroShotMetaDataClassify[1].score * 100).toFixed(2),
                                        (websiteOne.industryClassification.zeroShotMetaDataClassify[0].score * 100).toFixed(2),
                                        (websiteOne.industryClassification.zeroShotMetaDataClassify[2].score * 100).toFixed(2)
                                    ]}
                                />
                                : ''
                            )
                        }
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center'>
                            <FiEye />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Industry Classification
                        </div>
                    </div>

                    <div className="text-center w-1/3">
                        <div data-testid="website2-meta-score" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {!websiteTwo ? '-' : (websiteTwo.industryClassification && websiteTwo.industryClassification.zeroShotMetaDataClassify[0].score ? (websiteTwo.industryClassification.zeroShotMetaDataClassify[0].score * 100).toFixed(2) + '%' : '0%')}
                        </div>
                        <div data-testid="website2-meta-label" className='font-poppins-semibold text-sm sm:text-lg'>
                            {!websiteTwo ? '-' : (websiteTwo.industryClassification && websiteTwo.industryClassification.zeroShotMetaDataClassify[0].label ? websiteTwo.industryClassification.zeroShotMetaDataClassify[0].label : 'N/A')}
                        </div>
                        {
                            !websiteTwo ? '' : (websiteTwo.industryClassification ?

                                <ColumnChart
                                    dataLabel={[
                                        websiteTwo.industryClassification.zeroShotMetaDataClassify[1].label,
                                        websiteTwo.industryClassification.zeroShotMetaDataClassify[0].label,
                                        websiteTwo.industryClassification.zeroShotMetaDataClassify[2].label
                                    ]}
                                    dataSeries={[
                                        (websiteTwo.industryClassification.zeroShotMetaDataClassify[1].score * 100).toFixed(2),
                                        (websiteTwo.industryClassification.zeroShotMetaDataClassify[0].score * 100).toFixed(2),
                                        (websiteTwo.industryClassification.zeroShotMetaDataClassify[2].score * 100).toFixed(2)
                                    ]}
                                />
                                : ''
                            )
                        }
                    </div>
                </div>
            </div>

            {/* Domain match */}
            <div data-testid="sect-domain-match" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Domain Match
                </div>
                <div className="flex justify-between ">
                    <div className="text-center w-1/3">
                        <div data-testid="website1-domain-score" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {!websiteOne ? '-' : (websiteOne.industryClassification && websiteOne.industryClassification.zeroShotDomainClassify[0].score ? (websiteOne.industryClassification.zeroShotDomainClassify[0].score * 100).toFixed(2) + '%' : '0%')}
                        </div>
                        <div data-testid="website1-domain-label" className='font-poppins-semibold text-sm sm:text-lg'>
                            {!websiteOne ? '-' : (websiteOne.industryClassification && websiteOne.industryClassification.zeroShotDomainClassify[0].label ? websiteOne.industryClassification.zeroShotDomainClassify[0].label : 'N/A')}
                        </div>
                        {
                            !websiteOne ? '' : (websiteOne.industryClassification ?
                                <ColumnChart
                                    dataLabel={[
                                        websiteOne.industryClassification.zeroShotDomainClassify[1].label,
                                        websiteOne.industryClassification.zeroShotDomainClassify[0].label,
                                        websiteOne.industryClassification.zeroShotDomainClassify[2].label
                                    ]}
                                    dataSeries={[
                                        (websiteOne.industryClassification.zeroShotDomainClassify[1].score * 100).toFixed(2),
                                        (websiteOne.industryClassification.zeroShotDomainClassify[0].score * 100).toFixed(2),
                                        (websiteOne.industryClassification.zeroShotDomainClassify[2].score * 100).toFixed(2)
                                    ]}
                                />
                                : ''
                            )
                        }
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center'>
                            <FiCheck />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Domain Match
                        </div>
                    </div>

                    <div className="text-center w-1/3">
                        <div data-testid="website2-domain-score" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {!websiteTwo ? '-' : (websiteTwo.industryClassification && websiteTwo.industryClassification.zeroShotDomainClassify[0].score ? (websiteTwo.industryClassification.zeroShotDomainClassify[0].score * 100).toFixed(2) + '%' : '0%')}
                        </div>
                        <div data-testid="website2-domain-label" className='font-poppins-semibold text-sm sm:text-lg'>
                            {!websiteTwo ? '-' : (websiteTwo.industryClassification && websiteTwo.industryClassification.zeroShotDomainClassify[0].label ? websiteTwo.industryClassification.zeroShotDomainClassify[0].label : 'N/A')}
                        </div>
                        {
                            !websiteTwo ? '' : (websiteTwo.industryClassification ?
                                <ColumnChart
                                    dataLabel={[
                                        websiteTwo.industryClassification.zeroShotDomainClassify[1].label,
                                        websiteTwo.industryClassification.zeroShotDomainClassify[0].label,
                                        websiteTwo.industryClassification.zeroShotDomainClassify[2].label
                                    ]}
                                    dataSeries={[
                                        (websiteTwo.industryClassification.zeroShotDomainClassify[1].score * 100).toFixed(2),
                                        (websiteTwo.industryClassification.zeroShotDomainClassify[0].score * 100).toFixed(2),
                                        (websiteTwo.industryClassification.zeroShotDomainClassify[2].score * 100).toFixed(2)
                                    ]}
                                />
                                : ''
                            )
                        }
                    </div>
                </div>
            </div>

            <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 text-lg text-center'>
                On-Page SEO Analysis
                <InfoPopOver
                    data-testid="popup-info-onpage-seo"
                    heading="On-page SEO Analysis"
                    content="On-page SEO analysis involves fine-tuning webpages to improve their search engine visibility and enhance the user experience. By optimizing content directly on the page, we aim to achieve higher rankings on platforms like Google, ultimately driving more organic traffic to the site. </br></br>
                        <i>Unique Content</i>: Text from body tag is extracted and processed. The calculated percentage of unique words can be used to avoid keyword stuffing which enhances SEO. </br>
                        <i>Images</i>: All image elemenets are extracted and checked for alt text, image optimization and formats like PNG, JPEG, WebP, and SVG. Proper alt text improves accessibility and search rankings, while optimised images enhance loading times and user experience, benefiting SEO. </br>"
                    placement="bottom"
                />
            </h4>

            {/* Unique Content */}
            <div data-testid="sect-unique-content" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Unique Content
                </div>
                <div className="flex justify-between">
                    <div className="text-center w-1/3">
                        <div data-testid="website1-uniquewords" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {websiteOne?.seoAnalysis && websiteOne?.seoAnalysis.uniqueContentAnalysis && isUniqueContentAnalysis(websiteOne?.seoAnalysis.uniqueContentAnalysis) ?
                                websiteOne?.seoAnalysis.uniqueContentAnalysis.uniqueWordsPercentage.toFixed(2) + '%'
                                : '0%'
                            }
                        </div>
                        <div className='font-poppins-semibold text-sm sm:text-lg'>
                            Unique Words
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiBook />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Unique Content
                        </div>
                    </div>

                    <div className="text-center w-1/3">
                        <div data-testid="website2-uniquewords" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {websiteTwo?.seoAnalysis && websiteTwo?.seoAnalysis.uniqueContentAnalysis && isUniqueContentAnalysis(websiteTwo?.seoAnalysis.uniqueContentAnalysis) ?
                                websiteTwo?.seoAnalysis.uniqueContentAnalysis.uniqueWordsPercentage.toFixed(2) + '%'
                                : '0%'
                            }
                        </div>
                        <div className='font-poppins-semibold text-sm sm:text-lg'>
                            Unique Words
                        </div>
                    </div>
                </div>
            </div>

            {/* Image on page */}
            <div data-testid="sect-images" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Images
                </div>
                <div className="flex justify-between ">
                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        <div className='gap-3 grid lg:grid-cols-2'>
                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website1-missingAltText" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteOne?.seoAnalysis && websiteOne?.seoAnalysis.imageAnalysis && isImageAnalysis(websiteOne.seoAnalysis.imageAnalysis) ?
                                            websiteOne.seoAnalysis.imageAnalysis.missingAltTextCount
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Missing Alt. Text
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website1-nonOptimized" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteOne?.seoAnalysis && websiteOne?.seoAnalysis.imageAnalysis && isImageAnalysis(websiteOne.seoAnalysis.imageAnalysis) ?
                                            websiteOne.seoAnalysis.imageAnalysis.nonOptimizedCount
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Non-Optimized
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiImage />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Images
                        </div>
                    </div>

                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        <div className='gap-3 grid lg:grid-cols-2'>
                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website2-missingAltText" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteTwo?.seoAnalysis && websiteTwo?.seoAnalysis.imageAnalysis && isImageAnalysis(websiteTwo.seoAnalysis.imageAnalysis) ?
                                            websiteTwo.seoAnalysis.imageAnalysis.missingAltTextCount
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Missing Alt. Text
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website2-nonOptimized" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteTwo?.seoAnalysis && websiteTwo?.seoAnalysis.imageAnalysis && isImageAnalysis(websiteTwo.seoAnalysis.imageAnalysis) ?
                                            websiteTwo.seoAnalysis.imageAnalysis.nonOptimizedCount
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Non-Optimized
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 text-lg text-center'>
                Technical SEO Analysis
                <InfoPopOver
                    data-testid="popup-info-technical-seo"
                    heading="Technical SEO Analysis"
                    content="Technical SEO analysis refers to anything that makes your site easier for search engines to crawl, index and render. </br></br>
                        <i>Light House</i>: The Google PageSpeed Insights API is used to fetch scores for performance, accessibility, and best practices </br>
                        <i>Mobile Friendliness</i>: The viewport is configured to simulate a mobile device (375x667 pixels), sets mobile and touch capabilities, and checks if the page is fully loaded and responsive at the specified width. Mobile-friendly sites improve user experience, enhance SEO due to Google&apos;s mobile-first indexing, and can boost conversion rates by ensuring ease of use on mobile devices. </br>
                        <i>Site Speed</i>: The Google PageSpeed Insights API is used to check whether the load time exceeds 3 seconds. Faster load times improve user experience and engagement, and can boost SEO by enhancing search rankings and driving more traffic. </br>"
                    placement="bottom"
                />
            </h4>

            {/* LightHouseAnalysis */}
            <div data-testid="sect-lighthouse" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Light House
                </div>
                <div className="flex justify-between ">
                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        <div className='gap-3 grid md:grid-cols-2 lg:grid-cols-3 '>
                            <div data-testid="website1-lighthouse-performance" className="flex justify-center">
                                {websiteOne?.seoAnalysis && websiteOne?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteOne?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Performance" value={websiteOne?.seoAnalysis.lighthouseAnalysis.scores.performance} />
                                    :
                                    <CircularProgressComparison label="Performance" value={0} />
                                }
                            </div>
                            <div data-testid="website1-lighthouse-accessibility" className="flex justify-center">
                                {websiteOne?.seoAnalysis && websiteOne?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteOne?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Accessibility" value={websiteOne?.seoAnalysis.lighthouseAnalysis.scores.accessibility} />
                                    :
                                    <CircularProgressComparison label="Accessibility" value={0} />
                                }
                            </div>
                            <div data-testid="website1-lighthouse-bestpractices" className="flex justify-center">
                                {websiteOne?.seoAnalysis && websiteOne?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteOne?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Best Practices" value={websiteOne?.seoAnalysis.lighthouseAnalysis.scores.bestPractices} />
                                    :
                                    <CircularProgressComparison label="Best Practices" value={0} />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiActivity />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Light House
                        </div>
                    </div>

                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        <div className='gap-3 grid md:grid-cols-2 lg:grid-cols-3 '>
                            <div data-testid="website2-lighthouse-performance" className="flex justify-center">
                                {websiteTwo?.seoAnalysis && websiteTwo?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteTwo?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Performance" value={websiteTwo?.seoAnalysis.lighthouseAnalysis.scores.performance} />
                                    :
                                    <CircularProgressComparison label="Performance" value={0} />
                                }
                            </div>
                            <div data-testid="website2-lighthouse-accessibility" className="flex justify-center">
                                {websiteTwo?.seoAnalysis && websiteTwo?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteTwo?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Accessibility" value={websiteTwo?.seoAnalysis.lighthouseAnalysis.scores.accessibility} />
                                    :
                                    <CircularProgressComparison label="Accessibility" value={0} />
                                }
                            </div>
                            <div data-testid="website2-lighthouse-bestpractices" className="flex justify-center">
                                {websiteTwo?.seoAnalysis && websiteTwo?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteTwo?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Best Practices" value={websiteTwo?.seoAnalysis.lighthouseAnalysis.scores.bestPractices} />
                                    :
                                    <CircularProgressComparison label="Best Practices" value={0} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Friendly */}
            <div data-testid="sect-mobile-friendly" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Mobile Friendly
                </div>
                <div className="flex justify-between ">
                    <div data-testid="website1-mobilefriendly" className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        {websiteOne?.seoAnalysis && websiteOne?.seoAnalysis.mobileFriendlinessAnalysis && isMobileFriendlinessAnalysis(websiteOne.seoAnalysis.mobileFriendlinessAnalysis) ?
                            websiteOne.seoAnalysis.mobileFriendlinessAnalysis.isResponsive ? 'Yes' : 'No'
                            : '-'
                        }
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiSmartphone />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Mobile Friendly
                        </div>
                    </div>

                    <div data-testid="website2-mobilefriendly" className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        {websiteTwo?.seoAnalysis && websiteTwo?.seoAnalysis.mobileFriendlinessAnalysis && isMobileFriendlinessAnalysis(websiteTwo.seoAnalysis.mobileFriendlinessAnalysis) ?
                            websiteTwo.seoAnalysis.mobileFriendlinessAnalysis.isResponsive ? 'Yes' : 'No'
                            : '-'
                        }
                    </div>
                </div>
            </div>

            {/* Site Speed */}
            <div data-testid="sect-site-speed" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Site Speed
                </div>
                <div className="flex justify-between ">
                    <div className="text-center w-1/3">
                        <div data-testid="website1-sitespeed" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {websiteOne?.seoAnalysis && websiteOne?.seoAnalysis.siteSpeedAnalysis && isSiteSpeedAnalysis(websiteOne?.seoAnalysis.siteSpeedAnalysis) ?
                                websiteOne?.seoAnalysis.siteSpeedAnalysis.loadTime.toFixed(2)
                                : '0'
                            }
                        </div>
                        <div className='font-poppins-semibold text-sm sm:text-lg'>
                            seconds
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiClock />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Site Speed
                        </div>
                    </div>

                    <div className="text-center w-1/3">
                        <div data-testid="website2-sitespeed" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {websiteTwo?.seoAnalysis && websiteTwo?.seoAnalysis.siteSpeedAnalysis && isSiteSpeedAnalysis(websiteTwo?.seoAnalysis.siteSpeedAnalysis) ?
                                websiteTwo?.seoAnalysis.siteSpeedAnalysis.loadTime.toFixed(2)
                                : '0'
                            }
                        </div>
                        <div className='font-poppins-semibold text-sm sm:text-lg'>
                            seconds
                        </div>
                    </div>
                </div>
            </div>

            <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 text-lg text-center'>
                Online Reputation Management
                <InfoPopOver
                    data-testid="popup-info-technical-seo"
                    heading="Online Reputation Management"
                    content="Online Reputation Management (ORM) refers to the process of influencing and managing the public perception of a business or brand on the internet. 
                    It involves monitoring and addressing any online content, such as reviews, social media comments, news articles, to maintain or improve one's reputation."
                    placement="bottom"
                />
            </h4>

            {/* Social Media - Facebook */}
            <div data-testid="sect-social-media" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Social Media Engagement
                </div>
                <div className="flex justify-between ">
                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        <div className='gap-2 grid xl:grid-cols-3'>
                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website1-commentcount" className='font-poppins-bold text-2xl sm:text-3xl lg:text-4xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteOne?.shareCountdata && websiteOne?.shareCountdata.Facebook && websiteOne.shareCountdata.Facebook.comment_count ?
                                            websiteOne.shareCountdata.Facebook.comment_count
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Comment Count
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website1-reactioncount" className='font-poppins-bold text-2xl sm:text-3xl lg:text-4xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteOne?.shareCountdata && websiteOne?.shareCountdata.Facebook && websiteOne.shareCountdata.Facebook.reaction_count ?
                                            websiteOne.shareCountdata.Facebook.reaction_count
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Reaction Count
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website1-sharecount" className='font-poppins-bold text-2xl sm:text-3xl lg:text-4xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteOne?.shareCountdata && websiteOne?.shareCountdata.Facebook && websiteOne.shareCountdata.Facebook.share_count ?
                                            websiteOne.shareCountdata.Facebook.share_count
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Share Count
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiFacebook />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Social Media Engagement
                        </div>
                    </div>

                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        <div className='gap-2 grid xl:grid-cols-3'>
                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website2-commentcount" className='font-poppins-bold text-2xl sm:text-3xl lg:text-4xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteTwo?.shareCountdata && websiteTwo?.shareCountdata.Facebook && websiteTwo.shareCountdata.Facebook.comment_count ?
                                            websiteTwo.shareCountdata.Facebook.comment_count
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Comment Count
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website2-reactioncount" className='font-poppins-bold text-2xl sm:text-3xl lg:text-4xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteTwo?.shareCountdata && websiteTwo?.shareCountdata.Facebook && websiteTwo.shareCountdata.Facebook.reaction_count ?
                                            websiteTwo.shareCountdata.Facebook.reaction_count
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Reaction Count
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website2-sharecount" className='font-poppins-bold text-2xl sm:text-3xl lg:text-4xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteTwo?.shareCountdata && websiteTwo?.shareCountdata.Facebook && websiteTwo.shareCountdata.Facebook.share_count ?
                                            websiteTwo.shareCountdata.Facebook.share_count
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Share Count
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* News Sentiment */}
            <div data-testid="sect-news-sentiment" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Average Sentiment
                </div>
                <div className="flex justify-between ">
                    <div className="text-center w-1/3">
                        <span className='flex md:hidden flex-col justify-center h-full'>
                            Sorry, the donut graph is not available on mobile devices
                        </span>
                        {
                            !websiteOne ? '' : (websiteOne.scrapeNews ?
                                <span className="hidden md:block">
                                    <DonutChart
                                        dataLabel={['Positive', 'Neutral', 'Negative']}
                                        dataSeries={[
                                            (websiteOne.scrapeNews.reduce((sum, news) => sum + news.sentimentScores.positive, 0) / websiteOne.scrapeNews.length) * 100,
                                            (websiteOne.scrapeNews.reduce((sum, news) => sum + news.sentimentScores.neutral, 0) / websiteOne.scrapeNews.length) * 100,
                                            (websiteOne.scrapeNews.reduce((sum, news) => sum + news.sentimentScores.negative, 0) / websiteOne.scrapeNews.length) * 100
                                        ]}
                                        legendPosition='right'
                                    />
                                </span>
                                : ''
                            )
                        }
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center'>
                            <FiBookOpen />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Average News Sentiment
                        </div>
                    </div>

                    <div className="text-center w-1/3">
                        <span className='flex md:hidden flex-col justify-center h-full'>
                            Sorry, the donut graph is not available on mobile devices
                        </span>
                        {
                            !websiteTwo ? '' : (websiteTwo.scrapeNews ?
                                <span className="hidden md:block">
                                    <DonutChart
                                        dataLabel={['Positive', 'Neutral', 'Negative']}
                                        dataSeries={[
                                            (websiteTwo.scrapeNews.reduce((sum, news) => sum + news.sentimentScores.positive, 0) / websiteTwo.scrapeNews.length) * 100,
                                            (websiteTwo.scrapeNews.reduce((sum, news) => sum + news.sentimentScores.neutral, 0) / websiteTwo.scrapeNews.length) * 100,
                                            (websiteTwo.scrapeNews.reduce((sum, news) => sum + news.sentimentScores.negative, 0) / websiteTwo.scrapeNews.length) * 100
                                        ]}
                                        legendPosition='right'
                                    />
                                </span>
                                : ''
                            )
                        }
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div data-testid="sect-reviews" className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Reviews
                </div>
                <div className="flex justify-between ">
                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        <div className='gap-2 grid xl:grid-cols-2'>
                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website1-nps" className='font-poppins-bold text-3xl sm:text-5xl lg:text-4xl xl:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteOne?.reviews ?
                                            websiteOne.reviews.NPS
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        NPS
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website1-rating" className='font-poppins-bold text-3xl sm:text-5xl lg:text-4xl xl:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteOne?.reviews ?
                                            websiteOne.reviews.rating
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Rating
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website1-trustindex" className='font-poppins-bold text-3xl sm:text-5xl lg:text-4xl xl:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteOne?.reviews ?
                                            websiteOne.reviews.trustIndex
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Trust Index
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website1-recommendation-status" className='font-poppins-bold text-2xl sm:text-4xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteOne?.reviews && websiteOne?.reviews.recommendationStatus !== "" ?
                                            websiteOne.reviews.recommendationStatus
                                            : 'N/A'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-sm sm:text-lg'>
                                        <span className="block sm:hidden">Recommend. Status</span>
                                        <span className="hidden sm:block">Recommendation Status</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiEdit />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Reviews
                        </div>
                    </div>

                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        <div className='gap-2 grid xl:grid-cols-2'>
                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website2-nps" className='font-poppins-bold text-3xl sm:text-5xl lg:text-4xl xl:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteTwo?.reviews ?
                                            websiteTwo.reviews.NPS
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        NPS
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website2-rating" className='font-poppins-bold text-3xl sm:text-5xl lg:text-4xl xl:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteTwo?.reviews ?
                                            websiteTwo.reviews.rating
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Rating
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website2-trustindex" className='font-poppins-bold text-3xl sm:text-5xl lg:text-4xl xl:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteTwo?.reviews ?
                                            websiteTwo.reviews.trustIndex
                                            : '-'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-lg'>
                                        Trust Index
                                    </div>
                                </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-2 rounded-xl text-center flex justify-center items-center'>
                                <div>
                                    <div data-testid="website2-recommendation-status" className='font-poppins-bold text-2xl sm:text-4xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                        {websiteTwo?.reviews && websiteTwo?.reviews.recommendationStatus !== "" ?
                                            websiteTwo.reviews.recommendationStatus
                                            : 'N/A'
                                        }
                                    </div>
                                    <div className='font-poppins-semibold text-sm sm:text-lg'>
                                        <span className="block sm:hidden">Recommend. Status</span>
                                        <span className="hidden sm:block">Recommendation Status</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}