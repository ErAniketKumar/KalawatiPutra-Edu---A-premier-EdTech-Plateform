import React from "react";
import {
  ShoppingBag,
  Sparkles,
  Star,
  Zap,
  Heart,
  Gift,
} from "lucide-react";

const NoticeGoodiesStore = ({ setCurrentPage }) => (
  <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 pb-20">
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
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Goodies Store
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-900/30 rounded-full px-4 py-2 border border-emerald-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-semibold">Coming Soon</span>
          </div>

          <h1 className="text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
              Amazing Goodies
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're crafting something extraordinary for you. Premium goodies, exclusive merchandise, and developer essentials are on their way.
          </p>

          {/* Under Development Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700/20 to-teal-700/20 rounded-2xl p-8 mb-12 border border-purple-800/50 backdrop-blur-sm shadow-lg shadow-purple-900/50">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/10 to-teal-700/10 animate-pulse"></div>
            <div className="relative z-10 flex items-center justify-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full animate-spin shadow-md shadow-teal-900/60">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-extrabold text-white mb-2">Under Development</h3>
                <p className="text-emerald-300">
                  Our team is working hard to bring you the best shopping experience
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-gradient-to-br from-emerald-700/10 to-teal-700/10 border border-purple-800/50 rounded-2xl p-8 hover:border-purple-700/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-md shadow-purple-900/30">
            <div className="p-3 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-teal-900/50">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3">Premium Merchandise</h3>
            <p className="text-gray-300">
              High-quality apparel, accessories, and tech gadgets designed for developers and tech enthusiasts.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-purple-700/10 to-indigo-700/10 border border-purple-800/50 rounded-2xl p-8 hover:border-purple-700/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-md shadow-purple-900/30">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-purple-900/50">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3">Exclusive Items</h3>
            <p className="text-gray-300">
              Limited edition collectibles and exclusive items you won't find anywhere else.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-pink-700/10 to-purple-700/10 border border-purple-800/50 rounded-2xl p-8 hover:border-pink-600/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-md shadow-purple-900/30">
            <div className="p-3 bg-gradient-to-r from-pink-600 to-purple-700 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-pink-900/50">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3">Community Favorites</h3>
            <p className="text-gray-300">
              Curated selection based on community feedback and trending developer tools.
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
);

export default NoticeGoodiesStore;
