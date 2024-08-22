import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center">
                            <img src='/logo.svg' className="h-11 me-3" alt="WEE Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">WEE</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
                        <div>
                            <h2 className="mb-4 text-md font-semibold text-dark-primaryTextColor dark:text-primaryTextColor uppercase">Help</h2>
                            <ul className="text-dark-primaryTextColor dark:text-primaryTextColor font-regular">
                                <li className='mb-2'>
                                    <a href="/help#faq" className="hover:underline">FAQ</a>
                                </li>
                                <li className='mb-2'> 
                                    <a href="/help#tutorials" className="hover:underline">Tutorials</a>
                                </li>
                                <li className='mb-2'>
                                    <a href="/help#feedback" className="hover:underline">Provide feedback</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-4 text-md font-semibold text-dark-primaryTextColor dark:text-primaryTextColor uppercase">Contact us</h2>
                            <ul className="text-dark-primaryTextColor dark:text-primaryTextColor font-regular">
                                <li className='mb-1'>
                                    <p>Domain Name Services (Pty) Ltd</p>
                                    <p>Midrand, South Africa</p>
                                    <p>Phone: +27 11 568 2800</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <hr className="border-dark-primaryTextColor dark:border-primaryTextColor my-6 sm:mx-auto  lg:my-8" />

                <div>
                    <span className="text-sm text-dark-primaryTextColor dark:text-primaryTextColor sm:text-center">© 2024 Tech Odyssey. All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}