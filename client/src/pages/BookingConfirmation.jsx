import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    MapPin,
    Calendar,
    Users,
    Phone,
    MessageCircle,
    Download,
    Share2,
    Home,
    Navigation
} from 'lucide-react';
import { format } from 'date-fns';
import { useBooking } from '../context/BookingContext';

const BookingConfirmation = () => {
    const navigate = useNavigate();
    const { bookingData, resetBooking } = useBooking();

    // Redirect if no booking data
    if (!bookingData.bookingId || !bookingData.selectedLodge) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">No Booking Found</h1>
                    <p className="text-gray-600 mb-4">Please make a booking first.</p>
                    <Link to="/lodges" className="btn-primary">
                        Browse Lodges
                    </Link>
                </div>
            </div>
        );
    }

    const {
        selectedLodge,
        selectedRoom,
        checkIn,
        checkOut,
        guests,
        customerDetails,
        paymentMethod,
        bookingId
    } = bookingData;

    const totalNights = checkIn && checkOut
        ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
        : 1;

    const baseGuests = selectedRoom.baseGuests || selectedRoom.maxOccupancy || 1;
    const extraGuestPrice = selectedRoom.extraGuestPrice || 0;
    const extraGuests = Math.max(0, (guests || 1) - baseGuests);
    const perNightPrice = selectedRoom.price + extraGuests * extraGuestPrice;
    const totalPrice = perNightPrice * totalNights;

    const getWhatsAppShareUrl = () => {
        const message = `🙏 Booking Confirmed!\n\n` +
            `📋 Booking ID: ${bookingId}\n` +
            `🏨 ${selectedLodge.name}\n` +
            `🛏️ ${selectedRoom.name}\n` +
            `📅 ${checkIn ? format(new Date(checkIn), 'dd MMM yyyy') : 'Today'} - ${checkOut ? format(new Date(checkOut), 'dd MMM yyyy') : 'Tomorrow'}\n` +
            `💰 Total: ₹${totalPrice}\n\n` +
            `📍 Location: Near Sri Raghavendra Swamy Mutt, Mantralayam`;

        return `https://wa.me/?text=${encodeURIComponent(message)}`;
    };

    const getGoogleMapsUrl = () => {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLodge.address + ' Mantralayam')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-center mb-8"
                >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle size={48} className="text-white" />
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-gray-900 mb-2"
                    >
                        Booking Confirmed! 🎉
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600"
                    >
                        Your booking has been successfully confirmed
                    </motion.p>
                </motion.div>

                {/* Booking Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-3xl shadow-elevated overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm opacity-90">Booking ID</span>
                            <span className="font-mono font-bold text-lg">{bookingId}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <img
                                src={selectedLodge.images[0]}
                                alt={selectedLodge.name}
                                className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div>
                                <h2 className="font-bold text-xl">{selectedLodge.name}</h2>
                                <p className="text-white/80">{selectedRoom.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                        {/* Guest Info */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">Guest Name</span>
                            <span className="font-medium text-gray-900">{customerDetails.name}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">Mobile</span>
                            <span className="font-medium text-gray-900">{customerDetails.mobile}</span>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <Calendar size={20} className="text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Check-in</p>
                                    <p className="font-medium text-gray-900">
                                        {checkIn ? format(new Date(checkIn), 'dd MMM yyyy') : 'Today'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <Calendar size={20} className="text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Check-out</p>
                                    <p className="font-medium text-gray-900">
                                        {checkOut ? format(new Date(checkOut), 'dd MMM yyyy') : 'Tomorrow'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="flex items-center gap-2 text-gray-600">
                                <Users size={18} />
                                Guests
                            </span>
                            <span className="font-medium text-gray-900">{guests || 1} Guest(s)</span>
                        </div>

                        {/* Payment */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="font-medium text-gray-900">
                                {paymentMethod === 'payAtLodge' ? 'Pay at Lodge' : 'UPI Payment'}
                            </span>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between py-4 bg-primary-50 rounded-xl px-4 -mx-2">
                            <span className="font-bold text-gray-900">Total Amount</span>
                            <span className="text-2xl font-bold text-primary-600">₹{totalPrice}</span>
                        </div>

                        {/* Location */}
                        <div className="pt-4">
                            <p className="flex items-start gap-2 text-gray-600 mb-3">
                                <MapPin size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                                <span>{selectedLodge.address}</span>
                            </p>
                            <a
                                href={getGoogleMapsUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <Navigation size={18} />
                                Open in Google Maps
                            </a>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 bg-gray-50 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href={`tel:${selectedLodge.phone}`}
                                className="btn-call py-3 justify-center"
                            >
                                <Phone size={18} />
                                Call Lodge
                            </a>
                            <a
                                href={`https://wa.me/${selectedLodge.whatsapp?.replace(/[^0-9]/g, '')}?text=Hi, my booking ID is ${bookingId}. I have booked ${selectedRoom.name}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp py-3 justify-center"
                            >
                                <MessageCircle size={18} />
                                WhatsApp
                            </a>
                        </div>

                        <a
                            href={getWhatsAppShareUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                        >
                            <Share2 size={18} />
                            Share Booking Details
                        </a>
                    </div>
                </motion.div>

                {/* Home Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-8"
                >
                    <Link
                        to="/"
                        onClick={() => resetBooking()}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                </motion.div>

                {/* Important Notes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
                >
                    <h3 className="font-bold text-yellow-800 mb-3">Important Information</h3>
                    <ul className="space-y-2 text-sm text-yellow-700">
                        <li>• Check-in time: 12:00 PM | Check-out time: 11:00 AM</li>
                        <li>• Please carry a valid ID proof (Aadhar/Passport/DL)</li>
                        <li>• Contact the lodge if you're arriving late</li>
                        <li>• WhatsApp & SMS confirmation will be sent shortly</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
