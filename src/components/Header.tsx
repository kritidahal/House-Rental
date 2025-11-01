import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { RiHotelFill } from "react-icons/ri";

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-blue-800 p-2 shadow-md border-blue-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 transform transition duration-200 hover:scale-105 group"
          >
            <RiHotelFill className="h-8 w-8 text-white transition-transform duration-300 group-hover:text-blue-200" />
            <span className="text-3xl text-white font-extrabold tracking-tighter">
              HotelBooking.com
            </span>
          </Link>

          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <NavLink to="/my-bookings" label="My Bookings" />
                <NavLink to="/userPreferences" label="Preferences" />
                <NavLink to="/recommendations" label="Recommendations" />
                <SignOutButton />
              </>
            ) : (
              <Link
                to="/sign-in"
                className="flex items-center px-6 py-2 rounded-full bg-white text-blue-900 font-semibold 
                           transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-gray-50 
                           active:scale-95 shadow-sm"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

const NavLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200
               hover:bg-blue-800 hover:shadow-sm border border-transparent hover:border-blue-300
               active:bg-blue-700"
  >
    {label}
  </Link>
);

export default Header;