import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import MyHotels from './MyHotels';
import AddHotel from './AddHotel';
import Bookings from '../components/Bookings'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'hotels' | 'bookings' | 'addHotel'>('hotels');
  const navigate = useNavigate();
  const isAdmin = true;
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      navigate("/adminLogin");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  const BookingsContent = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>
      <p>View and manage bookings.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-blue-600 w-64 flex-shrink-0">
        <div className="p-4">
          <h2 className="text-white text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button onClick={() => setActiveTab('hotels')} className={`w-full text-left flex items-center px-4 py-2 text-white rounded-lg ${activeTab === 'hotels' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}>
              <span className="ml-3">My Hotels</span>
            </button>
            <button onClick={() => setActiveTab('bookings')} className={`w-full text-left flex items-center px-4 py-2 text-white rounded-lg ${activeTab === 'bookings' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}>
              <span className="ml-3">Bookings</span>
            </button>
            <button onClick={() => setActiveTab('addHotel')} className={`w-full text-left flex items-center px-4 py-2 text-white rounded-lg ${activeTab === 'addHotel' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}>
              <span className="ml-3">Add Hotel</span>
            </button>
          </div>
        </nav>
        <div className="absolute bottom-0 p-4">
          <button onClick={handleLogout} className="w-full px-20 flex items-center justify-center py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-lg">
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-20 bg-gray-50">
          {activeTab === 'hotels' && <MyHotels isAdmin={isAdmin} />}
          {activeTab === 'bookings' && <Bookings />}
          {activeTab === 'addHotel' && <AddHotel />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
