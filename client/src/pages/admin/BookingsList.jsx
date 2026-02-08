import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import { Search, Filter, Eye, Loader2, X, Check, Clock, LogIn, LogOut, Banknote, CreditCard, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const BookingsList = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [updatingPayment, setUpdatingPayment] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

    // Auto-refresh every 10 seconds
    useEffect(() => {
        fetchBookings(); // Initial fetch

        const interval = setInterval(() => {
            fetchBookingsQuietly(); // Auto-refresh
        }, 10000); // 10 seconds

        return () => clearInterval(interval); // Cleanup
    }, [statusFilter, user]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (statusFilter !== 'all') {
                filters.status = statusFilter;
            }
            // If user is lodge admin, filter by their lodge
            if (user?.lodgeId) {
                filters.lodgeId = user.lodgeId;
            }
            const data = await bookingAPI.getAll(filters);
            setBookings(data);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Silent refresh without loading spinner
    const fetchBookingsQuietly = async () => {
        try {
            setIsAutoRefreshing(true);
            const filters = {};
            if (statusFilter !== 'all') {
                filters.status = statusFilter;
            }
            if (user?.lodgeId) {
                filters.lodgeId = user.lodgeId;
            }
            const data = await bookingAPI.getAll(filters);
            setBookings(data);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsAutoRefreshing(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        setUpdatingStatus(bookingId);
        try {
            await bookingAPI.updateStatus(bookingId, newStatus);
            // Update local state
            setBookings(bookings.map(b =>
                b._id === bookingId ? { ...b, status: newStatus } : b
            ));
            if (selectedBooking?._id === bookingId) {
                setSelectedBooking({ ...selectedBooking, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handlePaymentUpdate = async (booking, paymentStatus) => {
        const id = booking._id || booking.bookingId;
        setUpdatingPayment(id);
        try {
            await bookingAPI.updatePaymentStatus(id, {
                paymentStatus,
                paymentMethod: paymentStatus === 'paid' ? 'payAtLodge' : booking.paymentMethod
            });
            // Update local state
            setBookings(bookings.map(b =>
                b._id === booking._id ? { ...b, paymentStatus } : b
            ));
            if (selectedBooking?._id === booking._id) {
                setSelectedBooking({ ...selectedBooking, paymentStatus });
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Failed to update payment. Please try again.');
        } finally {
            setUpdatingPayment(null);
        }
    };

    const filteredBookings = bookings.filter(b =>
        searchTerm === '' ||
        b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'checked-in': return 'bg-blue-100 text-blue-700';
            case 'checked-out': return 'bg-gray-100 text-gray-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getNextActions = (status) => {
        switch (status) {
            case 'pending':
                return [
                    { label: 'Confirm', status: 'confirmed', icon: Check, color: 'text-green-600 hover:bg-green-50' },
                    { label: 'Cancel', status: 'cancelled', icon: X, color: 'text-red-600 hover:bg-red-50' }
                ];
            case 'confirmed':
                return [
                    { label: 'Check In', status: 'checked-in', icon: LogIn, color: 'text-blue-600 hover:bg-blue-50' },
                    { label: 'Cancel', status: 'cancelled', icon: X, color: 'text-red-600 hover:bg-red-50' }
                ];
            case 'checked-in':
                return [
                    { label: 'Check Out', status: 'checked-out', icon: LogOut, color: 'text-purple-600 hover:bg-purple-50' }
                ];
            default:
                return [];
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Bookings
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Live
                        </span>
                    </h2>
                    <p className="text-gray-500 flex items-center gap-2">
                        Manage all incoming booking requests.
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            {isAutoRefreshing && <RefreshCw size={12} className="animate-spin" />}
                            Updated {format(lastRefresh, 'h:mm:ss a')}
                        </span>
                    </p>
                </div>
                <button
                    onClick={fetchBookings}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or Name..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked-in">Checked In</option>
                            <option value="checked-out">Checked Out</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">Guest</th>
                                <th className="px-6 py-4">Lodge</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-indigo-600 font-medium">
                                            {booking.bookingId}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{booking.customerDetails?.name}</div>
                                            <div className="text-xs text-gray-400">{booking.customerDetails?.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {booking.lodgeName || booking.lodge?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div>{booking.checkIn ? format(new Date(booking.checkIn), 'MMM dd, yyyy') : 'N/A'}</div>
                                            <div className="text-xs text-gray-400">
                                                to {booking.checkOut ? format(new Date(booking.checkOut), 'MMM dd, yyyy') : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹{booking.totalAmount?.toLocaleString() || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {/* Payment Method */}
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${booking.paymentMethod === 'upi'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {booking.paymentMethod === 'upi' ? (
                                                        <><CreditCard size={12} /> UPI</>
                                                    ) : (
                                                        <><Banknote size={12} /> Cash</>
                                                    )}
                                                </span>
                                                {/* Payment Status */}
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${booking.paymentStatus === 'paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {booking.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* View Details */}
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {/* Mark as Paid - Quick Action */}
                                                {booking.paymentStatus !== 'paid' && (
                                                    <button
                                                        onClick={() => handlePaymentUpdate(booking, 'paid')}
                                                        disabled={updatingPayment === booking._id}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Mark as Paid (Cash Received)"
                                                    >
                                                        {updatingPayment === booking._id ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : (
                                                            <Banknote size={18} />
                                                        )}
                                                    </button>
                                                )}
                                                {/* Quick Actions */}
                                                {getNextActions(booking.status).map((action) => (
                                                    <button
                                                        key={action.status}
                                                        onClick={() => handleStatusUpdate(booking._id, action.status)}
                                                        disabled={updatingStatus === booking._id}
                                                        className={`p-2 rounded-lg transition-colors ${action.color} disabled:opacity-50`}
                                                        title={action.label}
                                                    >
                                                        {updatingStatus === booking._id ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : (
                                                            <action.icon size={18} />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-bold">Booking Details</h3>
                            <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Booking Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Booking ID</p>
                                    <p className="font-mono font-bold text-indigo-600">{selectedBooking.bookingId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedBooking.status)}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                            </div>

                            {/* Guest Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-3">Guest Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="font-medium">{selectedBooking.customerDetails?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Mobile</p>
                                        <p className="font-medium">{selectedBooking.customerDetails?.mobile}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium">{selectedBooking.customerDetails?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Guests</p>
                                        <p className="font-medium">{selectedBooking.guests || 1}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stay Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-3">Stay Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Lodge</p>
                                        <p className="font-medium">{selectedBooking.lodgeName || selectedBooking.lodge?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Room</p>
                                        <p className="font-medium">{selectedBooking.roomName || selectedBooking.roomType || 'Standard'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Check In</p>
                                        <p className="font-medium">
                                            {selectedBooking.checkIn ? format(new Date(selectedBooking.checkIn), 'MMM dd, yyyy') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Check Out</p>
                                        <p className="font-medium">
                                            {selectedBooking.checkOut ? format(new Date(selectedBooking.checkOut), 'MMM dd, yyyy') : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ID Proof Details */}
                            {(selectedBooking.idType || selectedBooking.idNumber || selectedBooking.customerDetails?.idType) && (
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-3 text-amber-800">ID Proof Details</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-amber-700">ID Type</p>
                                            <p className="font-medium text-amber-900">{selectedBooking.idType || selectedBooking.customerDetails?.idType || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-amber-700">ID Number</p>
                                            <p className="font-medium font-mono text-amber-900">{selectedBooking.idNumber || selectedBooking.customerDetails?.idNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Details */}
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h4 className="font-semibold mb-3 text-green-800">Payment Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="text-green-700">Payment Method</p>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${selectedBooking.paymentMethod === 'upi'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {selectedBooking.paymentMethod === 'upi' ? (
                                                <><CreditCard size={14} /> UPI Payment</>
                                            ) : (
                                                <><Banknote size={14} /> Pay at Lodge (Cash)</>
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-green-700">Payment Status</p>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${selectedBooking.paymentStatus === 'paid'
                                            ? 'bg-green-200 text-green-800'
                                            : 'bg-yellow-200 text-yellow-800'
                                            }`}>
                                            {selectedBooking.paymentStatus || 'Pending'}
                                        </span>
                                    </div>
                                    {selectedBooking.paymentId && (
                                        <div className="col-span-2">
                                            <p className="text-green-700">Payment ID</p>
                                            <p className="font-mono text-xs text-green-900 bg-green-100 p-2 rounded mt-1">
                                                {selectedBooking.paymentId}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-green-200">
                                    <span className="font-semibold text-green-800">Total Amount</span>
                                    <span className="text-2xl font-bold text-green-700">
                                        ₹{selectedBooking.totalAmount?.toLocaleString() || 0}
                                    </span>
                                </div>

                                {/* Payment Action Button */}
                                {selectedBooking.paymentStatus !== 'paid' && (
                                    <button
                                        onClick={() => handlePaymentUpdate(selectedBooking, 'paid')}
                                        disabled={updatingPayment === selectedBooking._id}
                                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        {updatingPayment === selectedBooking._id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Banknote size={18} />
                                        )}
                                        Mark as Paid (Cash Received)
                                    </button>
                                )}
                            </div>

                            {/* Booking Timestamps */}
                            <div className="flex gap-4 text-xs text-gray-400">
                                <span>Created: {selectedBooking.createdAt ? format(new Date(selectedBooking.createdAt), 'MMM dd, yyyy hh:mm a') : 'N/A'}</span>
                                {selectedBooking.updatedAt && selectedBooking.updatedAt !== selectedBooking.createdAt && (
                                    <span>Updated: {format(new Date(selectedBooking.updatedAt), 'MMM dd, yyyy hh:mm a')}</span>
                                )}
                            </div>

                            {/* Special Requests */}
                            {selectedBooking.specialRequests && (
                                <div>
                                    <h4 className="font-semibold mb-2">Special Requests</h4>
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                                        {selectedBooking.specialRequests}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                {getNextActions(selectedBooking.status).map((action) => (
                                    <button
                                        key={action.status}
                                        onClick={() => handleStatusUpdate(selectedBooking._id, action.status)}
                                        disabled={updatingStatus === selectedBooking._id}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${action.status === 'cancelled'
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            } disabled:opacity-50`}
                                    >
                                        {updatingStatus === selectedBooking._id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <action.icon size={18} />
                                        )}
                                        {action.label}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 ml-auto"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsList;
