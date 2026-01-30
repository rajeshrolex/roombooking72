import React, { useState, useContext, createContext } from 'react';

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

    const calculateTotalNights = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0;
        const diff = new Date(bookingData.checkOut) - new Date(bookingData.checkIn);
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const calculateTotalPrice = () => {
        if (!bookingData.selectedRoom) return 0;
        const nights = calculateTotalNights();
        return bookingData.selectedRoom.price * nights * bookingData.rooms;
    };

    const value = {
        bookingData,
        updateBookingData,
        setDates,
        setGuests,
        setRooms,
        selectLodge,
        selectRoom,
        setCustomerDetails,
        setPaymentMethod,
        generateBookingId,
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
