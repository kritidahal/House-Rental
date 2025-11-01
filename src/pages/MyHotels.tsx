import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import axios from "axios";

type MyHotelsProps = {
  isAdmin: boolean;
};

const MyHotels = ({ isAdmin }: MyHotelsProps) => {
  const { data: hotelData, refetch } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => { },
    }
  );

  if (!hotelData || hotelData.length === 0) {
    return <span>No Hotels found</span>;
  }

  const handleDelete = async (hotelId: string) => {
    try {
      await axios.delete(`http://localhost:7000/api/hotels/${hotelId}`);
      alert("Hotel Data Deleted");
      refetch(); // Refetch the hotels after deletion
    } catch (error) {
      console.error("Error deleting hotel:", error);
      alert("Failed to delete the hotel");
    }
  };

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            data-testid="hotel-card"
            className="flex flex-col border border-slate-300 rounded-lg p-8 gap-5 bg-gray-300"
          >
            {/* Image */}
            {hotel.imageUrls && hotel.imageUrls.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto">
                {hotel.imageUrls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Hotel ${hotel.name} image ${index + 1}`}
                    className="h-48 w-72 object-cover rounded-md flex-shrink-0"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
                No Images Available
              </div>
            )}

            {/* Details */}
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>

            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />Rs. {hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>

            <span className="flex justify-end">
              {isAdmin ? (
                <button
                  onClick={() => handleDelete(hotel._id)}
                  className="flex bg-red-600 text-white text-xl font-bold p-2 hover:bg-red-500"
                >
                  Delete
                </button>
              ) : (
                <Link
                  to={`/edit-hotel/${hotel._id}`}
                  className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                >
                  View Details
                </Link>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
