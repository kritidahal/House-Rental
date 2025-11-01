import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

// Interfaces
interface Preferences {
  types: string[];
  facilities: string[];
  starRating: number;
  priceRange: string;
  guests: {
    adults: number;
    children: number;
  };
}

interface Hotel {
  _id: string;
  name: string;
  description: string;
  imageUrls: string[];
  type: string;
  facilities: string[];
  starRating: number;
  pricePerNight: number;
  adultCount: number;
  childCount: number;
}

interface ScoredHotel extends Hotel {
  score: number;
  matchPercentage: number;
}

const Recommendations = () => {
  // Fetch hotels using React Query
  const { data: hotels, isLoading: hotelsLoading } = useQuery("fetchHotels", () =>
    apiClient.fetchHotels()
  );

  // State for user preferences
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [prefLoading, setPrefLoading] = useState(true);
  const [prefError, setPrefError] = useState(false);

  // Fetch preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch("http://localhost:7000/api/user-preferences", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch preferences");

        const data = await res.json();
        setPreferences(data);
      } catch (err) {
        console.error("Error fetching preferences:", err);
        setPrefError(true);
      } finally {
        setPrefLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Calculate max possible score for percentage
  const calculateMaxPossibleScore = (prefs: Preferences): number => {
    let maxScore = 0;
    
    // Type match
    if (prefs.types.length > 0) maxScore += 20;
    
    // Facilities
    maxScore += prefs.facilities.length * 5;
    
    // Star rating (best case: exact match)
    maxScore += 10;
    
    // Price range
    maxScore += 15;
    
    // Guests
    maxScore += 10;
    
    return maxScore;
  };

  // Scoring logic based on user preferences
  const calculateMatchScore = (hotel: Hotel, prefs: Preferences): number => {
    let score = 0;

    // Type match
    if (prefs.types.includes(hotel.type)) score += 20;

    // Facilities match
    const matchedFacilities = hotel.facilities.filter((f) =>
      prefs.facilities.includes(f)
    );
    score += matchedFacilities.length * 5;

    // Star rating (closer to preference gets more points)
    const starDiff = Math.abs(prefs.starRating - hotel.starRating);
    score += Math.max(10 - starDiff * 2, 0);

    // Price range match
    const price = hotel.pricePerNight;
    const inRange = (range: string) => {
      if (range === "low") return price <= 100;
      if (range === "mid") return price > 100 && price <= 300;
      if (range === "high") return price > 300;
      return false;
    };
    if (inRange(prefs.priceRange)) score += 15;

    // Guest capacity match
    if (
      hotel.adultCount >= prefs.guests.adults &&
      hotel.childCount >= prefs.guests.children
    ) {
      score += 10;
    }

    return score;
  };

  if (hotelsLoading || prefLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hotels || !preferences || prefError) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>Failed to load recommendation data.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Return to homepage
        </Link>
      </div>
    );
  }

  // Calculate recommendations
  const maxPossibleScore = calculateMaxPossibleScore(preferences);
  const MINIMUM_MATCH_PERCENTAGE = 50; // Only show hotels with at least 30% match

  const recommendations: ScoredHotel[] = hotels
    .map((hotel) => {
      const score = calculateMatchScore(hotel, preferences);
      const matchPercentage = Math.round((score / maxPossibleScore) * 100);
      return { ...hotel, score, matchPercentage };
    })
    .filter((hotel) => hotel.matchPercentage >= MINIMUM_MATCH_PERCENTAGE)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recommended Hotels For You</h1>
      
      {recommendations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No recommendations found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find hotels matching your preferences.
          </p>
          <div className="space-x-4">
            <Link
              to="/hotels"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Browse All Hotels
            </Link>
            <Link
              to="/preferences"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Update Preferences
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {recommendations.length} hotels matching your preferences
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((hotel) => (
              <div
                key={hotel._id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={hotel.imageUrls[0]}
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                  {/**<div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {hotel.matchPercentage}% Match
                  </div>
                  **/}
                
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold">{hotel.name}</h2>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span>{hotel.starRating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {hotel.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <span className="font-bold">Rs.{hotel.pricePerNight}</span>
                      <span className="text-gray-500 text-sm"> / night</span>
                    </div>
                    <Link
                      to={`/detail/${hotel._id}`}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recommendations;