import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";

const ManageGoodies = () => {
  const [goodies, setGoodies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    coinPrice: "",
    stock: "",
    image: null,
    category: "Apparel", // Default category
    isPopular: false, // Default isPopular
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All"); // For filtering
  const categories = ["All", "Apparel", "Accessories", "Tech"];
  const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchGoodies = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/goodies`);
        setGoodies(Array.isArray(response.data) ? response.data : response.data.data || []);
      } catch (error) {
        console.error("Error fetching goodies", error);
        setGoodies([]);
        toast.error("Failed to fetch goodies");
      }
    };
    fetchGoodies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("coinPrice", formData.coinPrice);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("isPopular", formData.isPopular);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingId) {
        await axios.put(`${VITE_API_URL}/goodies/${editingId}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Item updated", {
          style: {
            background: "#1a202c",
            color: "#e2e8f0",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          },
        });
      } else {
        await axios.post(`${VITE_API_URL}/goodies`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Item created", {
          style: {
            background: "#1a202c",
            color: "#e2e8f0",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          },
        });
      }
      setFormData({
        name: "",
        description: "",
        price: "",
        coinPrice: "",
        stock: "",
        image: null,
        category: "Apparel",
        isPopular: false,
      });
      setEditingId(null);
      const response = await axios.get(`${VITE_API_URL}/goodies`);
      setGoodies(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error("Error saving goodie", error);
      toast.error("Error saving goodie");
    }
  };

  const handleEdit = async (goodie) => {
    setFormData({
      name: goodie.name,
      description: goodie.description,
      price: goodie.price,
      coinPrice: goodie.coinPrice,
      stock: goodie.stock,
      image: null,
      category: goodie.category,
      isPopular: goodie.isPopular,
    });
    setEditingId(goodie._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${VITE_API_URL}/goodies/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setGoodies(goodies.filter((goodie) => goodie._id !== id));
      toast.success("Item deleted", {
        style: {
          background: "#1a202c",
          color: "#e2e8f0",
          border: "1px solid rgba(16, 185, 129, 0.3)",
        },
      });
    } catch (error) {
      console.error("Error deleting goodie", error);
      toast.error("Error deleting goodie");
    }
  };

  // Filter goodies based on selected category
  const filteredGoodies = selectedCategory === "All"
    ? goodies
    : goodies.filter((goodie) => goodie.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-4 lg:p-8">
      <Toaster position="top-right" />
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute right-20 top-1/3 w-24 h-24 bg-teal-600/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute left-10 top-1/4 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="container mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-8">
          Manage Goodies
        </h1>

        {/* Category Filter Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 mb-8 shadow-lg shadow-gray-900/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Price (INR)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Coin Price</label>
              <input
                type="number"
                value={formData.coinPrice}
                onChange={(e) => setFormData({ ...formData, coinPrice: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                required
              >
                {categories.filter(cat => cat !== "All").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Popular</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPopular"
                    value="true"
                    checked={formData.isPopular === true}
                    onChange={() => setFormData({ ...formData, isPopular: true })}
                    className="mr-2 text-emerald-500 focus:ring-emerald-500/30"
                    required
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPopular"
                    value="false"
                    checked={formData.isPopular === false}
                    onChange={() => setFormData({ ...formData, isPopular: false })}
                    className="mr-2 text-emerald-500 focus:ring-emerald-500/30"
                    required
                  />
                  No
                </label>
              </div>
            </div>
            <div className="mb-4 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                rows="4"
                required
              />
            </div>
            <div className="mb-4 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-600/20 file:text-emerald-400 hover:file:bg-emerald-600/30 transition-all duration-300 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-semibold shadow-md hover:shadow-emerald-500/25"
          >
            {editingId ? "Update" : "Create"} Goodie
          </button>
        </form>

        {/* Goodies Table */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden shadow-lg shadow-gray-900/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold">Description</th>
                  <th className="px-6 py-4 text-sm font-semibold">Price (INR)</th>
                  <th className="px-6 py-4 text-sm font-semibold">Coin Price</th>
                  <th className="px-6 py-4 text-sm font-semibold">Stock</th>
                  <th className="px-6 py-4 text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-sm font-semibold">Popular</th>
                  <th className="px-6 py-4 text-sm font-semibold">Image</th>
                  <th className="px-6 py-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGoodies.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-gray-400">
                      No goodies found
                    </td>
                  </tr>
                ) : (
                  filteredGoodies.map((goodie) => (
                    <tr
                      key={goodie._id}
                      className="border-t border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300"
                    >
                      <td className="px-6 py-4 text-sm text-gray-100">{goodie.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{goodie.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-100">₹{goodie.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-100">{goodie.coinPrice}</td>
                      <td className="px-6 py-4 text-sm text-gray-100">{goodie.stock}</td>
                      <td className="px-6 py-4 text-sm text-gray-100">{goodie.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-100">{goodie.isPopular ? "Yes" : "No"}</td>
                      <td className="px-6 py-4">
                        {goodie.image ? (
                          <img
                            src={goodie.image}
                            alt={goodie.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-700/50"
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(goodie)}
                          className="p-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-sm hover:shadow-yellow-500/25"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goodie._id)}
                          className="p-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-sm hover:shadow-red-500/25"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGoodies;