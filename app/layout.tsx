export const maxDuration = 60;
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Study Buddy",
  description: "Your visual study companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('studybuddy-theme');
                  var theme = storedTheme || 'dark';
                  document.body.classList.add('no-transitions');
                  if (theme === 'dark') {
                    document.body.classList.add('c1-dark-body');
                    document.body.classList.remove('c1-light-body');
                  } else {
                    document.body.classList.add('c1-light-body');
                    document.body.classList.remove('c1-dark-body');
                  }
                  // Force reflow
                  document.body.offsetHeight;
                  setTimeout(function() {
                    document.body.classList.remove('no-transitions');
                  }, 50);
                } catch (e) {}
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
