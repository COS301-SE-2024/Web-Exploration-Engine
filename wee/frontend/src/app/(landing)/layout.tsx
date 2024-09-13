import { FlipWords } from '../components/FlipWords';
import '../global.css'
import { Providers } from "../providers";
import { BackgroundGradientAnimation } from '../components/BackgroundGradientAnimation';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Web Exploration Engine",
  icons: {
    icon: [
      { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
      { rel: "manifest", url: "/site.webmanifest" }
    ]
  }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <Providers>
            <BackgroundGradientAnimation>
              <div className="absolute z-50 inset-0 flex flex-col min-h-screen md:flex-row overflow-y-auto">

                <div className='flex-1 p-4 text-2xl font-bold text-white sm:min-h-[12rem] md:m-auto md:text-4xl lg:text-5xl min-h-[8rem] font-poppins-bold'>
                  <p>Efficiently</p>
                  <FlipWords words={['categorize', 'analyze', 'extract']}/> 
                  <p>data from the web</p>              
                </div>

                <div className='flex-1 p-4 bg-primaryBackgroundColor text-primaryTextColor rounded-t-2xl dark:bg-dark-primaryBackgroundColor dark:text-dark-primaryTextColor md:rounded-l-2xl md:rounded-r-none'> 
                  {children}
                </div>
                
              </div>
            </BackgroundGradientAnimation>
          </Providers>
        </body>
      </html>
    );
}