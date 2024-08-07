import '../global.css'
import { Providers } from "../providers";
import NavBar from '../components/NavBar';
import HelpPopup from '../components/HelpPopup';
import Footer from '../components/Footer';
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