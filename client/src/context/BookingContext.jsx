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
        checkInTime: '12:00',
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
        status: 'pending',
        amountPaid: null,
        balanceAmount: null
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

    const setCheckInTime = (time) => {
        setBookingData(prev => ({ ...prev, checkInTime: time }));
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
        const room = bookingData.selectedRoom;
        const baseGuests = room.baseGuests || room.maxOccupancy || 1;
        const extraGuestPrice = room.extraGuestPrice || 0;
        const extraGuests = Math.max(0, (bookingData.guests || 1) - baseGuests);
        const perNightPrice = room.price + (extraGuests * extraGuestPrice);
        return perNightPrice * nights * bookingData.rooms;
    };

    // Submit booking to API
    const submitBooking = async (paymentDetails = null) => {
        if (isSubmitting) return null;

        setIsSubmitting(true);
        try {
            const totalNights = calculateTotalNights();

            // Normalize payment method: 'upi' → 'online' for backend compatibility
            // Backend expects 'online' or 'payAtLodge'
            let normalizedPaymentMethod = bookingData.paymentMethod;
            if (normalizedPaymentMethod === 'upi') {
                normalizedPaymentMethod = 'online';
            }

            // Determine payment status based on payment details
            let paymentStatus = 'pending';
            if (paymentDetails?.status === 'paid') {
                paymentStatus = 'paid';
            }

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
                checkInTime: bookingData.checkInTime || '12:00',
                guests: bookingData.guests,
                rooms: bookingData.rooms,
                customerDetails: bookingData.customerDetails,
                paymentMethod: normalizedPaymentMethod, // Use normalized value
                totalAmount: calculateTotalPrice() || bookingData.selectedRoom?.price * totalNights,
                paymentDetails: paymentDetails,
                // Pass amountPaid and balanceAmount from payment details for partial payments
                amountPaid: paymentDetails?.amountPaid,
                balanceAmount: paymentDetails?.balanceAmount,
                // Explicitly set payment status at top level for clarity
                paymentStatus: paymentStatus
            };

            console.log('Submitting booking - Frontend method:', bookingData.paymentMethod, '→ Backend method:', normalizedPaymentMethod);
            console.log('Payment Status:', bookingPayload.paymentStatus);
            console.log('Payment Details:', paymentDetails);

            const result = await bookingAPI.create(bookingPayload);

            if (result && result.bookingId) {
                setBookingData(prev => ({
                    ...prev,
                    bookingId: result.bookingId,
                    status: 'confirmed',
                    amountPaid: result.amountPaid ?? paymentDetails?.amountPaid ?? null,
                    balanceAmount: result.balanceAmount ?? paymentDetails?.balanceAmount ?? null
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
            checkInTime: '12:00',
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
            status: 'pending',
            amountPaid: null,
            balanceAmount: null
        });
    };

    const value = {
        bookingData,
        isSubmitting,
        updateBookingData,
        setDates,
        setGuests,
        setRooms,
        setCheckInTime,
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
