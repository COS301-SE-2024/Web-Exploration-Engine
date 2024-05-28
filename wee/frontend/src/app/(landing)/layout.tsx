import { FlipWords } from '../components/FlipWords';
import '../global.css'
import { Providers } from "../providers";
import { BackgroundGradientAnimation } from '../components/BackgroundGradientAnimation';

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
              <div className="absolute z-50 inset-0 md:flex md:min-h-screen">

                <div className='text-white min-h-[10rem] p-4 font-poppins-bold text-2xl sm:min-h-[15rem] md:flex-1'>
                  <p>Efficiently</p>
                  <FlipWords words={['categorize', 'analyze', 'extract']}/> 
                  <p>data from the web</p>              
                </div>

                <div className='p-4 bg-primaryBackgroundColor text-primaryTextColor rounded-t-2xl min-h-[calc(100vh-10rem)] dark:bg-dark-primaryBackgroundColor dark:text-dark-primaryTextColor sm:min-h-[calc(100vh-15rem)] md:flex-1 md:rounded-l-2xl md:rounded-r-none'>
                  {children}
                </div>
                
              </div>
            </BackgroundGradientAnimation>
          </Providers>
        </body>
      </html>
    );
}