import React, { useState, useEffect } from "react";
import { getOrders } from "../../api";
import { useNavigate } from "react-router-dom";
import { Package, ChevronDown, Clock, CheckCircle, XCircle, Zap, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders(page);
        if (page === 1) {
          setOrders(response.data.orders);
        } else {
          setOrders(prev => [...prev, ...response.data.orders]);
        }
        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'processing':
        return <Zap className="w-4 h-4 text-blue-400" />;
      case 'shipped':
        return <Package className="w-4 h-4 text-purple-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Package className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 pb-20">
      <Toaster position="top-right" />
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -right-20 top-40 w-72 h-72 bg-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -left-20 top-1/2 w-64 h-64 bg-purple-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-md bg-black/40 border-b border-purple-800/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-teal-900/50">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Your Orders
              </h1>
            </div>
            <button
              onClick={() => navigate("/store")}
              className="text-emerald-400 hover:text-teal-300 font-medium flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Store
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {loading && orders.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-emerald-700/20 to-teal-700/20 rounded-full mb-6 border border-purple-800/50">
                <Package className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">No Orders Yet</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <button
                onClick={() => navigate("/store")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-teal-900/30"
              >
                Browse Goodies
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl shadow-lg border border-purple-800/50 backdrop-blur-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center mb-2 md:mb-0">
                        <Zap className="w-5 h-5 text-emerald-400 mr-2" />
                        <h3 className="text-xl font-bold text-white">Order #{order.orderId}</h3>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-2 font-medium ${order.status.toLowerCase() === 'pending' ? 'text-yellow-400' :
                          order.status.toLowerCase() === 'processing' ? 'text-blue-400' :
                            order.status.toLowerCase() === 'shipped' ? 'text-purple-400' :
                              order.status.toLowerCase() === 'completed' ? 'text-emerald-400' :
                                order.status.toLowerCase() === 'cancelled' ? 'text-red-400' : 'text-gray-400'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">PAYMENT</h4>
                        <p className="text-white capitalize">
                          {order.paymentMethod === 'money' ? 'Paid with Money' : 'Paid with Coins'}
                        </p>
                        <p className="text-emerald-300 font-medium">
                          {order.paymentMethod === 'money' ?
                            `₹${order.totalPrice.toLocaleString()}` :
                            `${order.totalCoinPrice.toLocaleString()} coins`}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">SHIPPING ADDRESS</h4>
                        <p className="text-white">{order.shippingAddress.name}</p>
                        <p className="text-gray-300">{order.shippingAddress.address}</p>
                        <p className="text-gray-300">{order.shippingAddress.pincode}</p>
                        <p className="text-gray-300">{order.shippingAddress.mobile}</p>
                      </div>
                    </div>

                    <div className="border-t border-purple-800/30 pt-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">ITEMS</h4>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.goodie._id} className="flex items-start">
                            <img
                              src={item.goodie.image}
                              alt={item.goodie.name}
                              className="w-16 h-16 object-cover rounded-lg border border-purple-800/50 mr-4"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-white">{item.goodie.name}</h5>
                              <div className="flex justify-between text-gray-300 mt-1">
                                <span>Qty: {item.quantity}</span>
                                <span className="text-emerald-300">
                                  {order.paymentMethod === 'money' ?
                                    `₹${(item.price * item.quantity).toLocaleString()}` :
                                    `${(item.coinPrice * item.quantity).toLocaleString()} coins`}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-700/50 to-indigo-700/50 border border-purple-800/50 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/30 flex items-center"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ChevronDown className="w-5 h-5 mr-2" />
                        Load More Orders
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Orders;