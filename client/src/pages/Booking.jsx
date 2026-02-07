import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    User,
    Phone,
    Mail,
    CreditCard,
    Building2,
    ChevronLeft,
    Check,
    Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { useBooking } from '../context/BookingContext';
import { idTypes } from '../data/mockData';

const Booking = () => {
    const navigate = useNavigate();
    const {
        bookingData,
        setCustomerDetails,
        setPaymentMethod,
        submitBooking,
        isSubmitting,
        calculateTotalNights,
        calculateTotalPrice
    } = useBooking();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        idType: 'aadhar',
        idNumber: ''
    });
    const [errors, setErrors] = useState({});

    // Redirect if no lodge/room selected
    if (!bookingData.selectedLodge || !bookingData.selectedRoom) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">No Room Selected</h1>
                    <p className="text-gray-600 mb-4">Please select a room first to proceed with booking.</p>
                    <button onClick={() => navigate('/lodges')} className="btn-primary">
                        Browse Lodges
                    </button>
                </div>
            </div>
        );
    }

    const { selectedLodge, selectedRoom, checkIn, checkOut, guests } = bookingData;
    const totalNights = calculateTotalNights() || 1;
    const totalPrice = selectedRoom.price * totalNights;

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
        else if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Enter valid 10-digit mobile';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Enter valid email';
        }
        if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setCustomerDetails(formData);
            setStep(2);
        }
    };

    const handlePaymentSelect = (method) => {
        setPaymentMethod(method);
    };

    const handleConfirmBooking = async () => {
        const result = await submitBooking();
        if (result) {
            navigate('/booking/confirmation');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-16 md:top-20 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <button
                        onClick={() => step === 1 ? navigate(-1) : setStep(1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ChevronLeft size={20} />
                        <span>{step === 1 ? 'Back to Lodge' : 'Back to Details'}</span>
                    </button>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200'
                                }`}>
                                {step > 1 ? <Check size={16} /> : '1'}
                            </div>
                            <span className="hidden sm:inline font-medium">Details</span>
                        </div>
                        <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`} />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200'
                                }`}>
                                2
                            </div>
                            <span className="hidden sm:inline font-medium">Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-soft"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Guest Details
                                </h2>

                                <div className="space-y-5">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter full name as per ID"
                                                className={`input-primary pl-10 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Mobile */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile Number *
                                        </label>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                placeholder="10-digit mobile number"
                                                maxLength={10}
                                                className={`input-primary pl-10 ${errors.mobile ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email (Optional)
                                        </label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="For booking confirmation"
                                                className={`input-primary pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    {/* ID Type & Number */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ID Type *
                                            </label>
                                            <select
                                                name="idType"
                                                value={formData.idType}
                                                onChange={handleInputChange}
                                                className="input-primary"
                                            >
                                                {idTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ID Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="idNumber"
                                                value={formData.idNumber}
                                                onChange={handleInputChange}
                                                placeholder="Enter ID number"
                                                className={`input-primary ${errors.idNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            />
                                            {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full btn-primary mt-8 py-4 text-lg"
                                >
                                    Continue to Payment
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-soft"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Payment Options
                                </h2>

                                <div className="space-y-4">
                                    {/* Pay at Lodge */}
                                    <label
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${bookingData.paymentMethod === 'payAtLodge'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={bookingData.paymentMethod === 'payAtLodge'}
                                            onChange={() => handlePaymentSelect('payAtLodge')}
                                            className="w-5 h-5 text-primary-500"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={20} className="text-primary-500" />
                                                <span className="font-semibold text-gray-900">Pay at Lodge</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Pay cash or UPI directly at the lodge during check-in
                                            </p>
                                        </div>
                                    </label>

                                    {/* UPI */}
                                    <label
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${bookingData.paymentMethod === 'upi'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={bookingData.paymentMethod === 'upi'}
                                            onChange={() => handlePaymentSelect('upi')}
                                            className="w-5 h-5 text-primary-500"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={20} className="text-primary-500" />
                                                <span className="font-semibold text-gray-900">UPI Payment</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    Instant Confirmation
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Pay securely via GPay, PhonePe, Paytm, or any UPI app
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Security Note */}
                                <div className="flex items-start gap-3 mt-6 p-4 bg-gray-50 rounded-xl">
                                    <Shield size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">100% Secure Booking</p>
                                        <p className="text-sm text-gray-600">
                                            Your booking is confirmed instantly. Get WhatsApp & SMS confirmation.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmBooking}
                                    className="w-full btn-primary mt-8 py-4 text-lg"
                                >
                                    Confirm Booking • ₹{totalPrice}
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-40">
                            <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>

                            {/* Lodge Info */}
                            <div className="flex gap-3 pb-4 mb-4 border-b border-gray-100">
                                <img
                                    src={selectedLodge.images[0]}
                                    alt={selectedLodge.name}
                                    className="w-20 h-20 object-cover rounded-xl"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900 line-clamp-2">{selectedLodge.name}</h4>
                                    <p className="text-sm text-gray-600">{selectedRoom.name}</p>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="space-y-3 pb-4 mb-4 border-b border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <Calendar size={16} />
                                        Check-in
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {checkIn ? format(new Date(checkIn), 'dd MMM yyyy') : 'Today'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <Calendar size={16} />
                                        Check-out
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {checkOut ? format(new Date(checkOut), 'dd MMM yyyy') : 'Tomorrow'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <Users size={16} />
                                        Guests
                                    </span>
                                    <span className="font-medium text-gray-900">{guests || 1}</span>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 pb-4 mb-4 border-b border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Room ({totalNights} night{totalNights > 1 ? 's' : ''})</span>
                                    <span className="text-gray-900">₹{selectedRoom.price * totalNights}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Taxes & Fees</span>
                                    <span className="text-green-600">Included</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total Amount</span>
                                <span className="text-2xl font-bold text-primary-600">₹{totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
