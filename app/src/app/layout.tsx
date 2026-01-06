import type { Metadata } from 'next';
import './globals.css';
import ThemeProviderClient from './ThemeProviderClient';


export const metadata: Metadata = {
  title: 'Turing Technologies - Call Manager App',
  description: 'Manage your calls efficiently',
  icons: {
    icon: '/images/TT_Logo_Cropped.png', 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
         @font-face {
        font-family: 'Avenir';
        src: url('fonts/AvenirLTStd-Black.otf') format('opentype');
        
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Avenir';
        src: url('/fonts/AvenirLTStd-Roman.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Avenir';
        src: url('/fonts/AvenirLTStd-Bold.otf') format('opentype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }

        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProviderClient>{children}</ThemeProviderClient>
      </body>
    </html>
  );
}
