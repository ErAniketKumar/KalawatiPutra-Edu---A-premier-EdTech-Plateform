import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    MessageSquare,
    Filter,
    Search,
    CheckCircle,
    XCircle,
    Clock3,
    Trash2,
    Eye,
    X,
    Video,
    Mic,
    MapPin
} from 'lucide-react';

const CounselingBookingsAdmin = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchBookings();
    }, [currentPage, statusFilter]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(
                `${VITE_API_URL}/counseling-bookings?page=${currentPage}&status=${statusFilter}&limit=10`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = await response.json();
            if (result.success) {
                setBookings(result.data);
                setTotalPages(result.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(
                `${VITE_API_URL}/counseling-bookings/${bookingId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );

            const result = await response.json();
            if (result.success) {
                fetchBookings();
                alert('Booking status updated successfully!');
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status');
        }
    };

    const deleteBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(
                `${VITE_API_URL}/counseling-bookings/${bookingId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = await response.json();
            if (result.success) {
                fetchBookings();
                alert('Booking deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('Failed to delete booking');
        }
    };

    const filteredBookings = bookings.filter(booking =>
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/20';
            case 'confirmed': return 'text-green-400 bg-green-400/20';
            case 'completed': return 'text-blue-400 bg-blue-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    const getSessionTypeIcon = (type) => {
        switch (type) {
            case 'video': return <Video size={16} />;
            case 'audio': return <Mic size={16} />;
            case 'in-person': return <MapPin size={16} />;
            default: return <Video size={16} />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-6">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text">
                            Counseling Bookings
                        </span>
                    </h1>
                    <p className="text-gray-400">Manage counseling session bookings</p>
                </motion.div>

                {/* Filters */}
                <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Client</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Session</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date & Time</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredBookings.map((booking) => (
                                        <motion.tr
                                            key={booking._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-700/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="flex items-center">
                                                        <User size={16} className="mr-2 text-gray-400" />
                                                        <span className="font-medium">{booking.name}</span>
                                                    </div>
                                                    <div className="flex items-center mt-1 text-sm text-gray-400">
                                                        <Mail size={14} className="mr-2" />
                                                        {booking.email}
                                                    </div>
                                                    <div className="flex items-center mt-1 text-sm text-gray-400">
                                                        <Phone size={14} className="mr-2" />
                                                        {booking.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {getSessionTypeIcon(booking.sessionType)}
                                                    <span className="ml-2 capitalize">{booking.sessionType}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <Calendar size={16} className="mr-2 text-gray-400" />
                                                    <span className="text-sm">
                                                        {new Date(booking.preferredDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <Clock size={16} className="mr-2 text-gray-400" />
                                                    <span className="text-sm">{booking.preferredTime}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {booking.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                                            className="p-2 text-green-400 hover:text-white hover:bg-green-600 rounded-lg transition-colors"
                                                            title="Confirm"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    {booking.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                                            className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteBooking(booking._id)}
                                                        className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-400">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Booking Detail Modal */}
                {selectedBooking && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                        <p className="text-white">{selectedBooking.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                        <p className="text-white">{selectedBooking.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                                        <p className="text-white">{selectedBooking.phone}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Session Type</label>
                                        <p className="text-white capitalize">{selectedBooking.sessionType}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Date</label>
                                        <p className="text-white">{new Date(selectedBooking.preferredDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Time</label>
                                        <p className="text-white">{selectedBooking.preferredTime}</p>
                                    </div>
                                </div>

                                {selectedBooking.message && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                        <p className="text-white bg-gray-700/50 p-3 rounded-lg">{selectedBooking.message}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Booking Date</label>
                                    <p className="text-white">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => updateBookingStatus(selectedBooking._id, 'confirmed')}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-colors"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CounselingBookingsAdmin;
