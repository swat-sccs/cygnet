import Nav from "@/components/nav";
import "./globals.css";
import { NextAuthProvider } from "./NextAuthProvider";
import Footer from "@/components/footer";
import { inter } from "./fonts";

export const metadata = {
  title: "Cygnet",
  description: "The Swarthmore student directory | by SCCS",
  generator: "Cygnet",
  applicationName: "Cygnet",
  keywords: ["Cygnet", "Swarthmore", "student", "directory"],
  authors: [{ name: "SCCS", url: "https://sccs.swarthmore.edu" }],
  creator: "Swarthmore College Computer Society",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <html lang="en" className={`${inter.variable} ${inter.className} h-full`}>
        <head>
          <script
            defer
            data-domain="cygnet.sccs.swarthmore.edu"
            src="https://plausible.sccs.swarthmore.edu/js/script.js"
          ></script>
        </head>
        <body className="min-h-full flex flex-col bg-bg text-fg">
          <Nav />
          <main className="flex-1 flex flex-col w-full pb-16">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </NextAuthProvider>
  );
}
