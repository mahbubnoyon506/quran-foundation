"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface TranslatedName {
  language_name: string;
  name: string;
}

interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: TranslatedName;
}

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch("/api/chapters");
        const data = await res.json();
        setChapters(data.chapters || []);
      } catch (err) {
        console.error("Error fetching chapters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/token", { method: "POST" });
        const data = await res.json();
        setToken(data.access_token);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };

    fetchToken();
  }, []);
  console.log("Token..🚀", token);
  console.log("Chapter..🚀", chapters);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Quran Chapters
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Header: Chapter Name + Badge */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {ch.name_simple}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ch.revelation_place === "makkah"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {ch.revelation_place.toUpperCase()}
              </span>
            </div>

            {/* Arabic Name */}
            <h3 className="text-3xl font-extrabold text-right text-gray-900 mb-2">
              {ch.name_arabic}
            </h3>

            {/* Translation / Complex Name */}
            <p className="text-gray-600 italic mb-4">
              {ch.translated_name.name} — {ch.name_complex}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-gray-500 mb-4 text-sm">
              <div>
                <strong>Verses:</strong> {ch.verses_count}
              </div>
              <div>
                <strong>Pages:</strong> {ch.pages[0]} - {ch.pages[1]}
              </div>
              <div>
                <strong>Bismillah:</strong> {ch.bismillah_pre ? "Yes" : "No"}
              </div>
              <div>
                <strong>Order:</strong> {ch.revelation_order}
              </div>
            </div>

            {/* Verses Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min((ch.verses_count / 286) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Verses progress relative to largest chapter
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
