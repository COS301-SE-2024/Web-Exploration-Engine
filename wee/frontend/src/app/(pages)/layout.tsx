import '../global.css'
import { Providers } from "../providers";
import NavBar from '../components/NavBar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className='min-h-screen font-poppins-regular bg-primaryBackgroundColor text-primaryTextColor dark:bg-dark-primaryBackgroundColor dark:text-dark-primaryTextColor'>
          <Providers>
            <NavBar/>
            {children}
          </Providers>
        </body>
      </html>
    );
}