"use client";

import React, { useEffect, useRef, useState } from "react";
import { ProviderResults } from "../components/types";
import ResultCard from "@/components/result-card";
import Loading from "./loading";
import { toast, Toaster } from "sonner";

interface ResultDate {
  date: string;
  href: string;
}

const isEqual = (a: ProviderResults, b: ProviderResults) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

const POLLING_INTERVAL = 3000;

const Home = () => {
  const [results, setResults] = useState<ProviderResults | null>(null);
  const [dates, setDates] = useState<ResultDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const previousResultsRef = useRef<ProviderResults | null>(null);
  const previousDatesRef = useRef<ResultDate[]>([]);

  const datesIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const resultsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDates = async () => {
    try {
      const res = await fetch("/api/4d-dates");
      if (!res.ok) throw new Error("Failed to fetch dates");
      const data = await res.json();

      if (JSON.stringify(previousDatesRef.current) !== JSON.stringify(data)) {
        if (previousDatesRef.current.length > 0) {
          toast.info("New draw dates available!");
        }
        setDates(data);
        previousDatesRef.current = data;

        if (!selectedDate || (data[0]?.date && data[0]?.date.split(" ")[0] !== selectedDate)) {
          setSelectedDate(data[0]?.date?.split(" ")[0] || null);
        }
      }
    } catch (err) {
      console.error("Error fetching dates:", err);
    }
  };

  const fetchData = async (dateParam?: string) => {
    try {
      const url = dateParam ? `/api/4d-results?date=${dateParam}` : "/api/4d-results";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch 4D results");
      const data = await res.json();

      if (previousResultsRef.current && !isEqual(previousResultsRef.current, data)) {
        toast.success("4D results have been updated!");
      }
      previousResultsRef.current = data;
      setResults(data);
      if (initialLoading) setInitialLoading(false);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  useEffect(() => {
    fetchDates();

    datesIntervalRef.current = setInterval(() => {
      fetchDates();
    }, POLLING_INTERVAL);

    return () => {
      if (datesIntervalRef.current) {
        clearInterval(datesIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchData(selectedDate);

      if (resultsIntervalRef.current) {
        clearInterval(resultsIntervalRef.current);
      }

      resultsIntervalRef.current = setInterval(() => {
        fetchData(selectedDate);
      }, POLLING_INTERVAL);
    }

    return () => {
      if (resultsIntervalRef.current) {
        clearInterval(resultsIntervalRef.current);
      }
    };
  }, [selectedDate]);

  if (initialLoading || !results) return <Loading />;

  return (
    <>
      <Toaster position="bottom-right" richColors duration={3500} />
      <main className="bg-gray-50 py-10 px-3 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">4D Results</h1>
        <div className="mb-8 text-center">
          <label className="mr-2">Select Draw Date:</label>
          <select
            value={selectedDate || ""}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-1.5 rounded shadow-sm"
          >
            {dates.map(({ date }) => {
              const dateValue = date.split(" ")[0];
              return (
                <option key={dateValue} value={dateValue}>
                  {date}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {results.damacai && (
            <ResultCard
              title="Damacai 4D"
              data={results.damacai}
              logoSrc="/damacai-result.webp"
              colorTheme={{
                titleBg: "bg-white",
                titleText: "text-blue-800",
              }}
            />
          )}
          {results.magnum && (
            <ResultCard
              title="Magnum 4D"
              data={results.magnum}
              logoSrc="/magnum-result.png"
              colorTheme={{
                titleBg: "text-[#FFFF00]",
                titleText: "bg-neutral-900",
              }}
            />
          )}
          {results.toto && (
            <ResultCard
              title="Sports Toto 4D"
              data={results.toto}
              logoSrc="/toto-result.png"
              colorTheme={{
                titleBg: "bg-red-800",
                titleText: "text-white",
              }}
            />
          )}
        </div>
        <div className="text-center text-sm text-gray-500">Auto-refreshing every 5 seconds</div>
      </main>
    </>
  );
};

export default Home;
