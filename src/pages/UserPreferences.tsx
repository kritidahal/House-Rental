import { useState } from "react";

const hotelTypes = [
  "Budget", "Boutique", "Luxury", "Ski Resort", "Business", "Family", "Romantic",
  "Hiking Resort", "Cabin", "Beach Resort", "Golf Resort", "Motel", "All Inclusive",
  "Pet Friendly", "Self Catering"
];

const facilities = [
  "Free WiFi", "Parking", "Airport Shuttle", "Family Rooms", "Non-Smoking Rooms",
  "Outdoor Pool", "Spa", "Fitness Center"
];

const UserPreferences = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [starRating, setStarRating] = useState(""); // Comma-separated values like "3,4,5"
  const [priceRange, setPriceRange] = useState(""); // Like "100-300"
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");

  const toggleSelection = (
    value: string,
    list: string[],
    setter: (val: string[]) => void
  ) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:7000/api/user-preferences", {
        method: "POST",
        credentials: "include", // Send cookies/session
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          types: selectedTypes,
          facilities: selectedFacilities,
          starRating,
          priceRange,
          guests: { adults, children },
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save preferences");
      }
  
      alert("Preferences saved!");
    } catch (err: any) {
      console.error("Error saving preferences:", err);
      alert("Failed to save preferences");
    }
  };
  

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Your Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hotel Types */}
        <div>
          <h3 className="font-semibold mb-2">Preferred Types</h3>
          <div className="flex flex-wrap gap-2">
            {hotelTypes.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                className={`px-3 py-1 rounded-full border ${
                  selectedTypes.includes(type)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="font-semibold mb-2">Facilities</h3>
          <div className="grid grid-cols-2 gap-2">
            {facilities.map((facility) => (
              <label key={facility} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={facility}
                  checked={selectedFacilities.includes(facility)}
                  onChange={() =>
                    toggleSelection(facility, selectedFacilities, setSelectedFacilities)
                  }
                />
                {facility}
              </label>
            ))}
          </div>
        </div>

        {/* Star Rating & Price Range */}
        <div className="flex gap-4">
          <input
            type="text"
            value={starRating}
            onChange={(e) => setStarRating(e.target.value)}
            placeholder="Star Ratings (e.g., 3,4,5)"
            className="border p-2 rounded w-1/2"
          />
          <input
            type="text"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            placeholder="Price Range (e.g., 100-300)"
            className="border p-2 rounded w-1/2"
          />
        </div>

        {/* Guests */}
        <div className="flex gap-4">
          <input
            type="number"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            placeholder="Adults"
            className="border p-2 rounded w-1/2"
          />
          <input
            type="number"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            placeholder="Children"
            className="border p-2 rounded w-1/2"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default UserPreferences;
