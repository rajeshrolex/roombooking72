import React, { useState, useContext, createContext } from 'react';
import { bookingAPI } from '../services/api';

const BookingContext = createContext();

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};

export const BookingProvider = ({ children }) => {
    const [bookingData, setBookingData] = useState({
        checkIn: null,
        checkOut: null,
        guests: 1,
        rooms: 1,
        selectedLodge: null,
        selectedRoom: null,
        customerDetails: {
            name: '',
            mobile: '',
            email: '',
            idType: '',
            idNumber: ''
        },
        paymentMethod: 'payAtLodge',
        bookingId: null,
        status: 'pending'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateBookingData = (data) => {
        setBookingData(prev => ({ ...prev, ...data }));
    };

    const setDates = (checkIn, checkOut) => {
        setBookingData(prev => ({ ...prev, checkIn, checkOut }));
    };

    const setGuests = (guests) => {
        setBookingData(prev => ({ ...prev, guests }));
    };

    const setRooms = (rooms) => {
        setBookingData(prev => ({ ...prev, rooms }));
    };

    const selectLodge = (lodge) => {
        setBookingData(prev => ({ ...prev, selectedLodge: lodge }));
    };

    const selectRoom = (room) => {
        setBookingData(prev => ({ ...prev, selectedRoom: room }));
    };

    const setCustomerDetails = (details) => {
        setBookingData(prev => ({
            ...prev,
            customerDetails: { ...prev.customerDetails, ...details }
        }));
    };

    const setPaymentMethod = (method) => {
        setBookingData(prev => ({ ...prev, paymentMethod: method }));
    };

    const calculateTotalNights = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 1;
        const diff = new Date(bookingData.checkOut) - new Date(bookingData.checkIn);
        const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 1;
    };

    const calculateTotalPrice = () => {
        if (!bookingData.selectedRoom) return 0;
        const nights = calculateTotalNights();
        return bookingData.selectedRoom.price * nights * bookingData.rooms;
    };

    // Submit booking to API
    const submitBooking = async () => {
        if (isSubmitting) return null;

        setIsSubmitting(true);
        try {
            const totalNights = calculateTotalNights();
            const bookingPayload = {
                lodgeId: bookingData.selectedLodge?._id || bookingData.selectedLodge?.id,
                lodgeName: bookingData.selectedLodge?.name,
                room: {
                    type: bookingData.selectedRoom?.type,
                    name: bookingData.selectedRoom?.name,
                    price: bookingData.selectedRoom?.price
                },
                checkIn: bookingData.checkIn || new Date(),
                checkOut: bookingData.checkOut || new Date(Date.now() + 86400000),
                guests: bookingData.guests,
                rooms: bookingData.rooms,
                customerDetails: bookingData.customerDetails,
                paymentMethod: bookingData.paymentMethod,
                totalAmount: calculateTotalPrice() || bookingData.selectedRoom?.price * totalNights
            };

            const result = await bookingAPI.create(bookingPayload);

            if (result && result.bookingId) {
                setBookingData(prev => ({
                    ...prev,
                    bookingId: result.bookingId,
                    status: 'confirmed'
                }));
                return result;
            }
            return null;
        } catch (error) {
            console.error('Error submitting booking:', error);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Legacy function for backward compatibility
    const generateBookingId = () => {
        const id = 'MLY' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
        setBookingData(prev => ({ ...prev, bookingId: id, status: 'confirmed' }));
        return id;
    };

    const resetBooking = () => {
        setBookingData({
            checkIn: null,
            checkOut: null,
            guests: 1,
            rooms: 1,
            selectedLodge: null,
            selectedRoom: null,
            customerDetails: {
                name: '',
                mobile: '',
                email: '',
                idType: '',
                idNumber: ''
            },
            paymentMethod: 'payAtLodge',
            bookingId: null,
            status: 'pending'
        });
    };

    const value = {
        bookingData,
        isSubmitting,
        updateBookingData,
        setDates,
        setGuests,
        setRooms,
        selectLodge,
        selectRoom,
        setCustomerDetails,
        setPaymentMethod,
        generateBookingId,
        submitBooking,
        resetBooking,
        calculateTotalNights,
        calculateTotalPrice
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

export default BookingContext;
