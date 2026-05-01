import React, { useState, useEffect } from 'react';
import { Trash2, Mail, User, Calendar } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const ContactManage = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch all contact messages
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${VITE_API_URL}/contacts`, {
          headers: {
            'Content-Type': 'application/json',
            // Add admin authentication header if needed, e.g., 'Authorization': 'Bearer your-token'
          }
        });
        const result = await response.json();
        
        if (response.ok && result.success) {
          setContacts(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch contacts');
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message || 'Error fetching contact messages', {
          position: 'top-right',
          duration: 3000,
          className: 'shadow-lg bg-red-600 text-white'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, []);

  // Handle delete contact message
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${VITE_API_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add admin authentication header if needed
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setContacts(contacts.filter(contact => contact._id !== id));
        toast.success('Message deleted successfully!', {
          position: 'top-right',
          duration: 3000,
          className: 'shadow-lg bg-emerald-600 text-white'
        });
      } else {
        throw new Error(result.message || 'Failed to delete message');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting contact message', {
        position: 'top-right',
        duration: 3000,
        className: 'shadow-lg bg-red-600 text-white'
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden p-6">
      <Toaster richColors />
      
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-10 left-20 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-600/20 to-teal-600/20 blur-3xl float-animation"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-600/15 to-blue-600/15 blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-transparent">
              Contact Message
            </span>
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              {' '}Management
            </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto"></div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-6 bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl mb-8">
            <p className="text-red-300 font-medium text-lg text-center">{error}</p>
          </div>
        )}

        {/* Contact Messages List */}
        {!isLoading && !error && contacts.length === 0 && (
          <div className="p-6 bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700/40 rounded-xl">
            <p className="text-gray-300 font-medium text-lg text-center">No contact messages found.</p>
          </div>
        )}

        {!isLoading && !error && contacts.length > 0 && (
          <div className="grid gap-6">
            {contacts.map((contact) => (
              <div key={contact._id} className="relative group hover-scale">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-6 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{contact.name}</p>
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Mail className="w-4 h-4 text-emerald-400" />
                            {contact.email}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-base">{contact.message}</p>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        {new Date(contact.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-600/30 hover-scale"
                    >
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Delete</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManage;