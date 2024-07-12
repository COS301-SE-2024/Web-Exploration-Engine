import '../global.css'
import { Providers } from "../providers";
import NavBar from '../components/NavBar';
import HelpPopup from '../components/HelpPopup';
import Footer from '../components/Footer';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Web Exploration Engine",
  icons: {
    icon: "favicon.ico",
  },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen font-poppins-regular bg-primaryBackgroundColor text-primaryTextColor dark:bg-dark-primaryBackgroundColor dark:text-dark-primaryTextColor">
          <Providers>
            <NavBar />
            {children}
            <HelpPopup/>
            <Footer/>
          </Providers>
        </body>
      </html>
    );
}