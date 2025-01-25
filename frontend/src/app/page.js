import Image from "next/image";

export default function Home() {
  return (

    <div className="sm:p-10">
      <div className="h-20 row-start-1 items-center">
        <img src="/zipscopeimage.png" className="h-full" />
      </div>

      <main className="flex flex-row">
        <div className="flex flex-row">
          <div className="basis-1/2 text-center sm:p-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-snug">
              Looking for your <br />
              next adventure or <br />
              place to call home?
            </h1>
            <a href="#" className="text-blue-600 text-lg font-semibold mt-4 inline-block">Explore ZipScope</a>
            <p class="text-gray-600 mt-4">
              Providing travelers and new home seekers insight into the best neighborhoods and cities to visit. We provide a 
              comprehensive summary of the best places to visit and live in the United States.
            </p>
          </div>
          <div className="basis-1/2 text-center flex justify-center items-center w-full">
            <div className="h-64 w-64 rounded-lg bg-[#004aad]" />
          </div>
        </div>

      </main>

      <div className="bg-black text-white py-16 rounded-lg">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold">
          Graded on These Metrics
        </h1>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Safety */}
          <div className="bg-white text-black rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <h2 className="font-semibold text-lg mb-4">
              Crime Rates <br /> and Safety
            </h2>
            <img
              src="/crime.png"
              className="w-24 h-24"
            />
            <p className="mt-2 text-sm">No Thieves</p>
          </div>

          {/* Transaction Details Section */}
          <div className="bg-white text-black rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <h2 className="font-semibold text-lg mb-4">
              Access to transaction <br /> detail in a second
            </h2>
            <img
              src=""
              alt="Transaction Details"
              className="w-32 h-32"
            />
            <p className="mt-2 text-sm">
              View and manage your transactions instantly.
            </p>
          </div>

          {/* Card Spend Section */}
          <div className="bg-white text-black rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <h2 className="font-semibold text-lg mb-4">
              Control card spend, <br /> before it happens.
            </h2>
            <img
              src="/path-to-card-image.jpg"
              alt="Control Card Spend"
              className="w-24 h-24"
            />
            <p className="mt-2 text-sm">
              Set limits and monitor your spending effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>

    
    /* <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.js
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div> */

  );
}
