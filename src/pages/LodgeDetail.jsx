import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MapPin,
    Phone,
    MessageCircle,
    Star,
    ChevronLeft,
    Share2,
    Heart,
    Navigation,
    Clock,
    Users,
    Calendar
} from 'lucide-react';
import PhotoGallery from '../components/lodge/PhotoGallery';
import RoomCard from '../components/lodge/RoomCard';
import { AmenityList } from '../components/lodge/AmenityBadge';
import { getLodgeBySlug } from '../data/mockData';
import { useBooking } from '../context/BookingContext';

const LodgeDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { selectLodge, selectRoom, bookingData } = useBooking();

    const lodge = getLodgeBySlug(slug);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (lodge) {
            selectLodge(lodge);
        }
    }, [lodge]);

    if (!lodge) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Lodge Not Found</h1>
                    <p className="text-gray-600 mb-4">The lodge you're looking for doesn't exist.</p>
                    <Link to="/lodges" className="btn-primary">
                        Browse All Lodges
                    </Link>
                </div>
            </div>
        );
    }

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        selectRoom(room);
    };

    const handleBookNow = () => {
        if (selectedRoom) {
            navigate('/booking');
        }
    };

    const getGoogleMapsUrl = () => {
        return `https://www.google.com/maps/search/?api=1&query=Sri+Raghavendra+Swamy+Mutt+Mantralayam`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar - Mobile */}
            <div className="md:hidden bg-white sticky top-16 z-40 border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`p-2 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`}
                        >
                            <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <button className="p-2 text-gray-600">
                            <Share2 size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Breadcrumb */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-primary-600">Home</Link>
                    <span>/</span>
                    <Link to="/lodges" className="hover:text-primary-600">Lodges</Link>
                    <span>/</span>
                    <span className="text-gray-900">{lodge.name}</span>
                </div>

                {/* Photo Gallery */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <PhotoGallery images={lodge.images} lodgeName={lodge.name} />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Lodge Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-soft mb-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        {lodge.name}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={16} className="text-primary-500" />
                                            {lodge.distance} from Mutt
                                        </span>
                                        <span className={`badge-distance ${lodge.distanceType === 'walkable'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {lodge.distanceType === 'walkable' ? 'Walking Distance' : 'Auto Distance'}
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`p-3 rounded-xl border-2 transition-all ${isFavorite
                                                ? 'border-red-500 text-red-500 bg-red-50'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                                    </button>
                                    <button className="p-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Rating & Reviews */}
                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
                                    <Star size={18} className="text-green-600 fill-green-600" />
                                    <span className="font-semibold text-green-700">{lodge.rating}</span>
                                </div>
                                <span className="text-gray-600">{lodge.reviewCount} reviews</span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                {lodge.description}
                            </p>
                        </motion.div>

                        {/* Room Types */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-soft mb-6"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Select a Room
                            </h2>
                            <div className="space-y-4">
                                {lodge.rooms.map((room) => (
                                    <RoomCard
                                        key={room.id}
                                        room={room}
                                        onSelect={handleRoomSelect}
                                        isSelected={selectedRoom?.id === room.id}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Amenities */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-soft mb-6"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Amenities
                            </h2>
                            <AmenityList amenities={lodge.amenities} />
                        </motion.div>

                        {/* Location */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-6 shadow-soft"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Location
                            </h2>
                            <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.8051981089815!2d77.37599!3d15.98683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb5e5d7a6e5e5e5%3A0x5e5e5e5e5e5e5e5e!2sSri%20Raghavendra%20Swamy%20Mutt!5e0!3m2!1sen!2sin!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lodge Location"
                                />
                            </div>
                            <p className="text-gray-600 mb-4">
                                <MapPin size={16} className="inline mr-2 text-primary-500" />
                                {lodge.address}
                            </p>
                            <a
                                href={getGoogleMapsUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <Navigation size={18} />
                                Get Directions
                            </a>
                        </motion.div>
                    </div>

                    {/* Sidebar - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-6 shadow-elevated"
                            >
                                {/* Price */}
                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <p className="text-sm text-gray-500">Starting from</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-gray-900">₹{lodge.priceStarting}</span>
                                        <span className="text-gray-500">/ night</span>
                                    </div>
                                </div>

                                {/* Selected Room */}
                                {selectedRoom && (
                                    <div className="mb-6 pb-6 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Selected Room</p>
                                        <div className="p-3 bg-primary-50 rounded-xl">
                                            <p className="font-semibold text-gray-900">{selectedRoom.name}</p>
                                            <p className="text-primary-600 font-bold">₹{selectedRoom.price}/night</p>
                                        </div>
                                    </div>
                                )}

                                {/* Booking Button */}
                                <button
                                    onClick={handleBookNow}
                                    disabled={!selectedRoom}
                                    className={`w-full py-4 rounded-xl text-lg font-semibold transition-all ${selectedRoom
                                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {selectedRoom ? 'Book Now' : 'Select a Room to Book'}
                                </button>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <a
                                        href={`tel:${lodge.phone}`}
                                        className="btn-call py-3 text-sm justify-center"
                                    >
                                        <Phone size={18} />
                                        Call
                                    </a>
                                    <a
                                        href={`https://wa.me/${lodge.whatsapp?.replace(/[^0-9]/g, '')}?text=Hi, I want to book a room at ${lodge.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-whatsapp py-3 text-sm justify-center"
                                    >
                                        <MessageCircle size={18} />
                                        WhatsApp
                                    </a>
                                </div>

                                {/* Info */}
                                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Clock size={18} className="text-gray-400" />
                                        <span>Check-in: 12:00 PM | Check-out: 11:00 AM</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Users size={18} className="text-gray-400" />
                                        <span>ID proof required at check-in</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">
                            {selectedRoom ? selectedRoom.name : 'Starting from'}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                            ₹{selectedRoom ? selectedRoom.price : lodge.priceStarting}
                            <span className="text-sm font-normal text-gray-500">/night</span>
                        </p>
                    </div>
                    <button
                        onClick={handleBookNow}
                        disabled={!selectedRoom}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedRoom
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {selectedRoom ? 'Book Now' : 'Select Room'}
                    </button>
                </div>
            </div>

            {/* Mobile Footer Spacer */}
            <div className="md:hidden h-20" />
        </div>
    );
};

export default LodgeDetail;
