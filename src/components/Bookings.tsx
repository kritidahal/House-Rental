import { useQuery } from "react-query";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiMoney, BiUser, BiCalendar } from "react-icons/bi";
import * as apiClient from "../api-client"; // Adjust based on your API client

const Bookings = () => {
  // Fetching the hotels with booking data
  const { data: hotelData, isLoading, isError } = useQuery(
    "fetchMyHotelsWithBookings",
    apiClient.fetchMyHotels,
    {
      onError: () => {
        console.error("Error fetching bookings data");
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !hotelData || hotelData.length === 0) {
    return <div>Error fetching bookings or no hotels available</div>;
  }

  // Filter out hotels with no bookings
  const hotelsWithBookings = hotelData.filter((hotel) => hotel.bookings && hotel.bookings.length > 0);

  if (hotelsWithBookings.length === 0) {
    return <div>No hotels with bookings found</div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold mb-5">Hotel Bookings</h1>
      <div className="grid grid-cols-1 gap-8"> {/* Single column layout */}
        {hotelsWithBookings.map((hotel) => (
          <div
            key={hotel._id}
            className="flex flex-col border border-slate-300 rounded-lg p-5 gap-4 bg-white shadow-md"
          >
            {/* Hotel Images */}
            {hotel.imageUrls && hotel.imageUrls.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto">
                {hotel.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Hotel ${hotel.name} image ${index + 1}`}
                    className="h-72 w-full object-cover rounded-md" // Full width image with fixed height
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
                No Images Available
              </div>
            )}

            {/* Hotel Info */}
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="text-sm text-gray-500">{hotel.description}</div>

            <div className="grid grid-cols-2 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />
                Rs. {hotel.pricePerNight} per night
              </div>
            </div>

            {/* Booking Information */}
            {hotel.bookings && hotel.bookings.length > 0 && (
              <div className="mt-5">
                <h3 className="text-lg font-semibold">Bookings</h3>
                <div className="space-y-3">
                  {hotel.bookings.map((booking: any) => (
                    <div
                      key={booking._id}
                      className="border border-slate-300 p-3 rounded-md bg-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.firstName} {booking.lastName}</p>
                          <p className="text-sm">{booking.email}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <BiCalendar className="mr-1" />
                          {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="flex items-center">
                          <BiUser className="mr-1" />
                          {booking.adultCount} Adults, {booking.childCount} Children
                        </div>
                        <div className="flex items-center">
                          <BiMoney className="mr-1" />
                          Rs. {booking.totalCost}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
