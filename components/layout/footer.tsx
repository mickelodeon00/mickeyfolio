"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Footer() {
  const [pixabayImage, setPixabayImage] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [location, setLocation] = useState<string | null>("Lagos, NG");

  useEffect(() => {
    // Fetch random image from Pixabay
    // In a real app, you would use your Pixabay API key
    const fetchPixabayImage = async () => {
      try {
        // This is a placeholder. In a real app, use your Pixabay API key
        // const response = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=nature&per_page=3`);
        // const data = await response.json();
        // setPixabayImage(data.hits[0].webformatURL);

        // For demo purposes, using a placeholder
        setPixabayImage("/placeholder.svg?height=100&width=100");
      } catch (error) {
        console.error("Error fetching Pixabay image:", error);
      }
    };

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        // This would be a real weather API call in production
        // For demo, just setting a random temperature
        setTemperature(Math.floor(Math.random() * 15) + 20);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchPixabayImage();
    fetchWeather();
  }, []);

  return (
    <footer className="w-full py-6 bg-background border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Link
            href="https://github.com/mickelodeon00"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5 hover:text-primary transition-colors" />
          </Link>
          <Link
            href="https://x.com/Mickelodeon00"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="h-5 w-5 hover:text-primary transition-colors" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/micheal-akingbade-90038225a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-5 w-5 hover:text-primary transition-colors" />
          </Link>
        </div>

        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Micheal. All rights reserved.
        </div>

        <div className="flex items-center mt-4 md:mt-0">
          {temperature && location && (
            <div className="text-sm mr-4">
              {temperature}°C {location}
            </div>
          )}

          {pixabayImage && (
            <div className="relative h-10 w-10 rounded-md overflow-hidden">
              <Image
                src={pixabayImage || "/placeholder.svg"}
                alt="Pixabay Image"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
