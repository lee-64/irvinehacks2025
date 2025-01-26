'use client';

import { useEffect, useState } from 'react';
import InteractiveMap from '@/components/InteractiveMap';
import MapSearch from '@/components/MapSearch';
import ErrorAlert from '@/components/ErrorAlert';


export default function Home() {
  const [scrollAmount, setScrollAmount] = useState(0);
  const [locData, setLocData] = useState(0);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);

  const cards = [
    { imgSrc: '/cops.png', title: 'Crime Rates and Safety', description: 'No Thieves' },
    { imgSrc: '/lebronhouse.png', title: 'Housing Prices', description: 'Average home prices in the area.' },
    { imgSrc: '/ihs.png', title: 'Public Education Quality', description: 'Ratings of high schools in the area.' },
    { imgSrc: '/transport.png', title: 'Transportation', description: 'Ease of access to public transit and roads.' },
    { imgSrc: '/enviornment.png', title: 'Environment', description: 'Air and water quality in the area.' },
    { imgSrc: '/healthcare.png', title: 'Health', description: 'Availability of hospitals and healthcare services.' },
  ];

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setScrollAmount(window.scrollY);
  };

  function opacity(scrollAmt) {
    if (scrollAmt < window.innerHeight / 2) {
      return 0;
    } else if (scrollAmt < window.innerHeight) {
      return (scrollAmt - window.innerHeight / 2) / (window.innerHeight / 2);
    } else {
      return 1;
    }
  }

  const handleMapSearch = async (mapSearch) => {
    setError(null); // Clear any previous errors
    if (!mapSearch?.trim()) {
      alert('Please enter a valid prompt.');
      return;
    }

    setLoading(true);
    // setStatus(null);

    try {
      const submitResponse = await fetch('/api/fetch_location_data', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          query: mapSearch,
          // config: configState
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });


      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        setError(
          submitResponse.status === 400
            ? 'Address/location not found, please try again'
            : 'An error occurred while processing your request. Please try again.'
        );
        return;
      }

      const submitData = await submitResponse.json();
      setLocData(submitData);

    } catch (error) {
      setError("An error occurred while processing your request. Please try again.");
      // setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentSet < cards.length - 3) setCurrentSet(currentSet + 1);
  };

  const handlePrev = () => {
    if (currentSet > 0) setCurrentSet(currentSet - 1);
  };

  return (
    <div className="sm:p-10">
      {/* Add the Compare Locations button here */}
      <div className="absolute top-4 right-4">
        <Link href="/compare">
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow">
            Compare Locations
          </button>
        </Link>
      </div>
  
      <div className="h-20 row-start-1 items-center">
        <img src="/zipscopeimage.png" className="h-full" />
      </div>
  
      <div className="h-screen flex items-center flex-row">
        <div className="basis-1/2 text-center sm:p-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-snug">
            Looking for your <br />
            next adventure or <br />
            place to call home?
          </h1>
          <p className="text-blue-600 text-lg font-semibold mt-4 inline-block">Explore ZipScope</p>
          <p className="text-gray-600 mt-4">
            Providing travelers and new home seekers insight into the best neighborhoods and cities to visit. We provide a
            comprehensive summary of the best places to visit and live in the United States.
          </p>
        </div>
        <div className="basis-1/2 text-center flex justify-center items-center w-full">
          <div className="h-96 w-96 rounded-lg ">
            <img src="/skyline.png" className="h-auto rounded-lg" />
          </div>
        </div>
      </div>
  
      {/* Scrolling Opacity Element */}
      <div
        className="py-16 rounded-lg"
        style={{
          opacity: opacity(scrollAmount),
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Based on the following metrics...</h1>
  
          <div className="flex items-center justify-center mt-12">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-300 rounded-lg mx-2 shadow hover:bg-gray-400"
            >
              &lt;
            </button>
  
            <div className="grid md:grid-cols-3 gap-8">
              {cards.slice(currentSet, currentSet + 3).map((card, index) => (
                <div
                  key={index}
                  className="bg-blue-900 rounded-2xl shadow-lg p-6 flex flex-col items-center w-60 h-60"
                >
                  <img src={card.imgSrc} alt={card.title} className="w-auto h-24 rounded-2xl" />
                  <h2 className="font-semibold text-lg mt-4 text-white">{card.title}</h2>
                  <p className="mt-2 text-sm text-center text-white">{card.description}</p>
                </div>
              ))}
            </div>
  
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gray-300 rounded-lg mx-2 shadow hover:bg-gray-400"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      <div className="h-screen rounded-lg w-full sm:p-20">
        <MapSearch onSubmit={handleMapSearch} placeholder="9955 Beverly Grove Dr." />
        <ErrorAlert message={error} />
        <InteractiveMap latitude={locData.lat} longitude={locData.lon} desirability={locData.score} />
      </div>
    </div>
  );
}