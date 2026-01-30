import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    Search,
    ChevronDown,
    MapPin
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useBooking } from '../../context/BookingContext';

const SearchBar = ({ variant = 'default', className = '' }) => {
    const navigate = useNavigate();
    const { setDates, setGuests, bookingData } = useBooking();

    const today = new Date();
    const tomorrow = addDays(today, 1);

    const [checkIn, setCheckIn] = useState(format(today, 'yyyy-MM-dd'));
    const [checkOut, setCheckOut] = useState(format(tomorrow, 'yyyy-MM-dd'));
    const [guests, setGuestsValue] = useState(1);
    const [showGuestDropdown, setShowGuestDropdown] = useState(false);

    const handleSearch = () => {
        setDates(new Date(checkIn), new Date(checkOut));
        setGuests(guests);
        navigate(`/lodges?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    };

    const isHero = variant === 'hero';

    return (
        <div className={`${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`
          ${isHero
                        ? 'bg-white rounded-2xl shadow-elevated p-4 md:p-6'
                        : 'bg-white rounded-xl shadow-card p-3 md:p-4'
                    }
        `}
            >
                <div className={`
          grid gap-3 md:gap-4
          ${isHero
                        ? 'grid-cols-1 md:grid-cols-4'
                        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
                    }
        `}>
                    {/* Location - Static for Mantralayam */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Location
                        </label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700">
                            <MapPin size={18} className="text-primary-500" />
                            <span className="font-medium">Mantralayam</span>
                        </div>
                    </div>

                    {/* Check-in Date */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Check-in
                        </label>
                        <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                value={checkIn}
                                min={format(today, 'yyyy-MM-dd')}
                                onChange={(e) => {
                                    setCheckIn(e.target.value);
                                    if (new Date(e.target.value) >= new Date(checkOut)) {
                                        setCheckOut(format(addDays(new Date(e.target.value), 1), 'yyyy-MM-dd'));
                                    }
                                }}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Check-out Date */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Check-out
                        </label>
                        <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                value={checkOut}
                                min={format(addDays(new Date(checkIn), 1), 'yyyy-MM-dd')}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Guests */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Guests
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Users size={18} className="text-gray-400" />
                                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                                </span>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${showGuestDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Guest Dropdown */}
                            {showGuestDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-elevated border border-gray-100 overflow-hidden z-20"
                                >
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => {
                                                setGuestsValue(num);
                                                setShowGuestDropdown(false);
                                            }}
                                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${guests === num ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                                                }`}
                                        >
                                            {num} {num === 1 ? 'Guest' : 'Guests'}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className={`
            w-full mt-4 flex items-center justify-center gap-2 
            bg-gradient-to-r from-primary-500 to-primary-600 
            hover:from-primary-600 hover:to-primary-700 
            text-white font-semibold rounded-xl 
            shadow-lg hover:shadow-xl 
            transition-all duration-300 
            transform hover:scale-[1.02] active:scale-[0.98]
            ${isHero ? 'py-4 text-base' : 'py-3 text-sm'}
          `}
                >
                    <Search size={20} />
                    Search Lodges
                </button>
            </motion.div>
        </div>
    );
};

export default SearchBar;
