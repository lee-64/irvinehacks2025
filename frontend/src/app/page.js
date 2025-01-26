'use client';

import { useEffect, useState } from 'react';
import InteractiveMap from '@/components/InteractiveMap';
import MapSearch from '@/components/MapSearch';
import ErrorAlert from '@/components/ErrorAlert';

export default function Home() {
  const [scrollAmount, setScrollAmount] = useState(0);
  const [locData, setLocData] = useState(0);
  const [error, setError] = useState(null);


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    setScrollAmount(window.scrollY);
  };

  function opacity(scrollAmt){
    if (scrollAmt < window.innerHeight / 2){
      return 0;
    }
    else if (scrollAmt < window.innerHeight){
      return (scrollAmt - window.innerHeight / 2) / (window.innerHeight / 2);
    }
    else{
      return 1;
    }
  }

  const handleMapSearch = async (mapSearch) => {
    setError(null); // Clear any previous errors
    if (!mapSearch?.trim()) {
        alert("Please enter a valid prompt.");
        return;
    }

    console.log('searching:', mapSearch);

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
          if (submitResponse.status === 400) {
              setError("Address/location not found, please try again");
          } else {
              setError("An error occurred while processing your request. Please try again.");
          }
          return;
      }

      const submitData = await submitResponse.json();
      console.log('Submit response:', submitData);
      setLocData(submitData);
    } catch (error) {
      console.error("Error processing the search query:", error);
      setError("An error occurred while processing your request. Please try again.");
    }
  };


  return (
    <div className="sm:p-10">
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
            <img src="/skyline.png" className="h-auto, rounded-lg" />
          </div>
        </div>
      </div>

      {/* Scrolling Opacity Element */}
      <div className="py-16 rounded-lg" style={{
        opacity: opacity(scrollAmount)
      }}>
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold">
          Based on These Metrics
        </h1>

        <div className="grid md:grid-cols-3 gap-8 mt-12">

          {/* Crime Rates and Safety */}
          <div className="bg-[#D7DBDD] rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <img
              src="/cops.png"
              alt="Police Cars"
              className="w-auto h-auto rounded-2xl"
            />
            <h2 className="font-semibold text-lg mb-4">
              <br /> Crime Rates and Safety
            </h2>
            <p className="mt-2 text-sm">No Thieves</p>
          </div>

          {/* Housing Prices */}
          <div className="bg-[#D7DBDD] rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <img
              src="/lebronhouse.png"
              alt="Lebron James's House"
              className="w-auto h-auto rounded-2xl"
            />
            <h2 className="font-semibold text-lg mb-4">
              <br /> Housing Prices
            </h2>
            <p className="mt-2 text-sm">
              Average home prices in the area.
            </p>
          </div>

          {/* Education Quality */}
          <div className="bg-[#D7DBDD] rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <img
              src="/ihs.png"
              alt="Irvine High School"
              className="w-auto h-auto rounded-2xl"
            />
            <h2 className="font-semibold text-lg mb-4">
              <br /> Public Education Quality
            </h2>
            <p className="mt-2 text-sm">
              Ratings of high schools in the area.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="h-screen rounded-lg w-full sm:p-20">
      <MapSearch
        onSubmit={handleMapSearch}
        placeholder="9955 Beverly Grove Dr."  // TODO animated alternating placeholders, eg "90089"..."Irvine"..."3651 Trousdale Pkwy, LA"...
      />
      <ErrorAlert
          message={error}
      />
      <InteractiveMap
        latitude={locData.lat}
        longitude={locData.lon}
        desirability={locData.score}
      />
    </div>
  </div>
  );
}