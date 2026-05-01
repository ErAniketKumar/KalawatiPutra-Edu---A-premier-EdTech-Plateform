import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    Video,
    AudioLines,
    Users,
    MessageCircle,
    Filter,
    Search,
    Eye,
    Edit,
    Trash2,
    X,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const CounselingBookingsManager = ({ bookings, setBookings }) => {
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        filterBookings();
    }, [bookings, searchTerm, statusFilter]);

    const filterBookings = () => {
        let filtered = bookings;

        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.phone.includes(searchTerm)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        setFilteredBookings(filtered);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <AlertCircle className="w-4 h-4 text-yellow-400" />;
            case 'confirmed':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-blue-400" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-400" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-900 text-yellow-300 border-yellow-600';
            case 'confirmed':
                return 'bg-green-900 text-green-300 border-green-600';
            case 'completed':
                return 'bg-blue-900 text-blue-300 border-blue-600';
            case 'cancelled':
                return 'bg-red-900 text-red-300 border-red-600';
            default:
                return 'bg-gray-900 text-gray-300 border-gray-600';
        }
    };

    const getSessionTypeIcon = (type) => {
        switch (type) {
            case 'video':
                return <Video className="w-4 h-4" />;
            case 'audio':
            case 'phone':
                return <AudioLines className="w-4 h-4" />;
            case 'in-person':
                return <Users className="w-4 h-4" />;
            default:
                return <Video className="w-4 h-4" />;
        }
    };

    const updateBookingStatus = async (bookingId, newStatus) => {
        setIsLoading(true);
        try {
            const response = await axios.put(
                `${VITE_API_URL}/counseling-bookings/${bookingId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            if (response.data.success) {
                const updatedBookings = bookings.map(booking =>
                    booking._id === bookingId
                        ? { ...booking, status: newStatus }
                        : booking
                );
                setBookings(updatedBookings);

                if (selectedBooking && selectedBooking._id === bookingId) {
                    setSelectedBooking({ ...selectedBooking, status: newStatus });
                }
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        setIsLoading(true);
        try {
            const response = await axios.delete(
                `${VITE_API_URL}/counseling-bookings/${bookingId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            if (response.data.success) {
                const updatedBookings = bookings.filter(booking => booking._id !== bookingId);
                setBookings(updatedBookings);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('Failed to delete booking');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (timeString.includes(':')) {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            return `${displayHour}:${minutes} ${period}`;
        }
        return timeString;
    };

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBookings = filteredBookings.slice(startIndex, endIndex);

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['pending', 'confirmed', 'completed', 'cancelled'].map(status => {
                    const count = bookings.filter(b => b.status === status).length;
                    return (
                        <div key={status} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm capitalize">{status}</p>
                                    <p className="text-2xl font-bold text-white">{count}</p>
                                </div>
                                {getStatusIcon(status)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Session
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {currentBookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                <User size={20} className="text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{booking.name}</div>
                                                <div className="text-sm text-gray-400">{booking.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-300">
                                            <Phone size={16} className="mr-2" />
                                            {booking.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-300">
                                                <Calendar size={16} className="mr-2" />
                                                {formatDate(booking.preferredDate)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-300">
                                                <Clock size={16} className="mr-2" />
                                                {formatTime(booking.preferredTime)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-300">
                                                {getSessionTypeIcon(booking.sessionType)}
                                                <span className="ml-2 capitalize">{booking.sessionType}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            <span className="ml-1 capitalize">{booking.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteBooking(booking._id)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                                title="Delete"
                                                disabled={isLoading}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-gray-900 px-6 py-3 flex items-center justify-between border-t border-gray-700">
                        <div className="text-sm text-gray-400">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm text-gray-300">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Detail Modal */}
            {isModalOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white">Booking Details</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-medium text-white mb-4">Client Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <User size={16} className="text-gray-400 mr-3" />
                                                <span className="text-gray-300">{selectedBooking.name}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Mail size={16} className="text-gray-400 mr-3" />
                                                <span className="text-gray-300">{selectedBooking.email}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone size={16} className="text-gray-400 mr-3" />
                                                <span className="text-gray-300">{selectedBooking.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-medium text-white mb-4">Session Details</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <Calendar size={16} className="text-gray-400 mr-3" />
                                                <span className="text-gray-300">{formatDate(selectedBooking.preferredDate)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock size={16} className="text-gray-400 mr-3" />
                                                <span className="text-gray-300">{formatTime(selectedBooking.preferredTime)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                {getSessionTypeIcon(selectedBooking.sessionType)}
                                                <span className="text-gray-300 ml-3 capitalize">{selectedBooking.sessionType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedBooking.message && (
                                    <div>
                                        <h4 className="text-lg font-medium text-white mb-3">Message</h4>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <p className="text-gray-300">{selectedBooking.message}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-lg font-medium text-white mb-3">Status Management</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => updateBookingStatus(selectedBooking._id, status)}
                                                disabled={isLoading || selectedBooking.status === status}
                                                className={`px-4 py-2 rounded-lg border transition-colors ${selectedBooking.status === status
                                                        ? getStatusColor(status)
                                                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                <span className="capitalize">{status}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-400">
                                    <p>Created: {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                                    {selectedBooking.updatedAt && (
                                        <p>Updated: {new Date(selectedBooking.updatedAt).toLocaleString()}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No bookings found</h3>
                    <p className="text-gray-500">No counseling bookings match your current filters.</p>
                </div>
            )}
        </div>
    );
};

export default CounselingBookingsManager;
