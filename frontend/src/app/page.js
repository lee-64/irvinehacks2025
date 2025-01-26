'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import InteractiveMap from '@/components/InteractiveMap';
import MapSearch from '@/components/MapSearch';
import ErrorAlert from '@/components/ErrorAlert';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function Home() {
  const [scrollAmount, setScrollAmount] = useState(0);
  const [locData, setLocData] = useState(0);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);

  const cards = [
    { imgSrc: '/cops.png', title: 'Safety', description: 'No Thieves' },
    { imgSrc: '/lebronhouse.png', title: 'Housing', description: 'Average home prices in the area.' },
    { imgSrc: '/ihs.png', title: 'Education', description: 'Ratings of high schools in the area.' },
    { imgSrc: '/transport.png', title: 'Transportation', description: 'Ease of access to public transit and roads.' },
    { imgSrc: '/enviornment.png', title: 'Environment', description: 'Air and water quality in the area.' },
    { imgSrc: '/healthcare.png', title: 'Healthcare', description: 'Availability of hospitals and healthcare services.' },
  ];

  const rotateCarousel = () => {
    setCurrentSet((prevSet) => (prevSet + 1) % cards.length);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    const interval = setInterval(rotateCarousel, 3000); // Rotate every 3 seconds
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
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
    setStatus(null);

    try {
      const submitResponse = await fetch('/api/fetch_location_data', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          query: mapSearch
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
      setStatus("success");

    } catch (error) {
      setError("An error occurred while processing your request. Please try again.");
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  const renderPieChart = (score, title, isHigher) => {
    const data = [
      { name: 'Score', value: score },
      { name: 'Remaining', value: 100 - score },
    ];

    const COLORS = isHigher ? ['#4CAF50', '#E0E0E0'] : ['#F44336', '#E0E0E0'];

    return (
      <div className="flex flex-col items-center">
        <h2 className={`text-xl font-bold ${isHigher ? 'text-green-600' : 'text-red-600'}`}>
          {title}
        </h2>
        <ResponsiveContainer width={100} height={100}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={40}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="sm:p-10">
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
          <div className="h-96 w-96 rounded-lg">
            <img src="/skyline.png" className="h-auto rounded-lg" />
          </div>
        </div>
      </div>

      <div
        className="py-16 bg-gradient-to-r from-gray-100 via-white to-gray-100"
        style={{
          opacity: opacity(scrollAmount),
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Based on the following metrics...</h1>
          <div className="flex items-center justify-center space-x-6">
            {[cards[currentSet], cards[(currentSet + 1) % cards.length], cards[(currentSet + 2) % cards.length]].map(
              (card, index) => (
                <div
  key={index}
  className="bg-white rounded-xl shadow-lg p-4 w-48 h-48 transform transition-transform duration-300 hover:scale-105"
>
                  <img src={card.imgSrc} alt={card.title} className="w-full h-28 object-cover rounded-lg mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700">{card.title}</h2>
                  <p className="mt-2 text-gray-500">{card.description}</p>
                </div>
              )
            )}
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {cards.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentSet ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

    <div className="min-h-screen" style={{display: 'flex'}}>
      <div className="min-h-screen" style={{flex: '50%'}}>
        <div className="min-h-screen w-full sm:mr-20" style={{ marginRight: '90px' }}>
          <MapSearch
              onSubmit={handleMapSearch}
              placeholder="568 N Tigertail Rd, Los Angeles"  // TODO animated alternating placeholders, eg "90089"..."Irvine"..."3651 Trousdale Pkwy, LA"...
          />
          <ErrorAlert
              message={error}
          />

          {status === "success" && !loading && (
              <div className="flex flex-col items-center justify-center gap-4 mt-8">
                <div style={{width: '80%'}}>
                  <br/><br/><br/><p className="col-span-2">{locData.explanation}</p><br/><br/>
                </div>
                <div className="h-80" style={{display: 'flex'}}>
                  <div className="w-full sm:mr-20" style={{flex: '50%'}}>
                    {renderPieChart(locData.safety_score, "Safety", locData.safety_score > 50)}
                  </div>
                  <div className="w-full sm:mr-20" style={{flex: '50%'}}>
                    {renderPieChart(locData.environmental_score, "Pollution", locData.environmental_score > 50)}
                  </div>
                </div>
                <div className="h-80" style={{display: 'flex'}}>
                  <div className="w-full sm:mr-20" style={{flex: '50%'}}>
                    {renderPieChart(locData.health_score, "Health", locData.health_score > 50)}
                  </div>
                  <div className="w-full sm:mr-20" style={{flex: '50%'}}>
                    {renderPieChart(locData.school_score, "Education", locData.school_score > 50)}
                  </div>
                </div>
                <div className="h-80" style={{display: 'flex'}}>
                  <div className="w-full sm:mr-20" style={{flex: '50%'}}>
                    {renderPieChart(locData.walk_score, "Transportation", locData.walk_score > 50)}
                  </div>
                  <div className="w-full sm:mr-20" style={{flex: '50%'}}>
                    {renderPieChart(locData.housing_score, "Housing", locData.housing_score > 50)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="column flex-1" style={{ flex: '50%' }}>
          <div className="min-h-screen w-full">
            <InteractiveMap
              latitude={locData.lat}
              longitude={locData.lon}
              desirability={locData.overall_score}
            />
          </div>
        </div>
        {loading && (
          <div className="flex items-center justify-center space-x-6">
          {cards.map((card, index) => {
            const isMiddle = index === currentSet;
            const isLeft = (index === (currentSet - 1 + cards.length) % cards.length);
            const isRight = (index === (currentSet + 1) % cards.length);

            return (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg p-8 w-48 h-48 transform transition-transform duration-300 ${
                  isMiddle ? "opacity-100 scale-100" :
                  isLeft || isRight ? "opacity-50 scale-90" :
                  "opacity-0 scale-75"
                }`}
                style={{
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              >
                <img
                  src={card.imgSrc}
                  alt={card.title}
                  className="w-full h-20 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
                <p className="mt-2 text-gray-500">{card.description}</p>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}