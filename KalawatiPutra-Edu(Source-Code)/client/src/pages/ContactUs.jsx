import React, { useState } from "react";
import {
  Send,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Globe,
  Sparkles,
  Users,
  MessageCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [teamVisible, setTeamVisible] = useState(true);

  const VITE_API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch(`${VITE_API_URL}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setFormData({ name: "", email: "", message: "" });
          toast.success("Message sent successfully!", {
            position: "top-right",
            duration: 3000,
            className: "shadow-lg bg-emerald-600 text-white",
          });
        } else {
          toast.error(result.message || "Failed to submit message", {
            position: "top-right",
            duration: 3000,
            className: "shadow-lg bg-red-600 text-white",
          });
        }
      } catch (error) {
        toast.error("An error occurred while sending the message", {
          position: "top-right",
          duration: 3000,
          className: "shadow-lg bg-red-600 text-white",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const teamMembers = [
    {
      name: "Aniket Kumar",
      role: "Founder & CEO",
      description: "Visionary leader driving educational innovation.",
      image: "/Images/aniket_pic2.jpg",
      email: "ceo@kalawatiputra.com",
      linkedin: "https://www.linkedin.com/in/eraniket",
      delay: "0.1s",
    },
    {
      name: "Akshat Angra",
      role: "CPO (Chief Product Officer)",
      description: "Building robust solutions for seamless experiences.",
      image: "/Images/akshat_pic.jpg",
      email: "akshat.angra@kalawatiputra.com",
      linkedin: "https://www.linkedin.com/in/akshatangra/",
      delay: "0.3s",
    },
    {
      name: "Akshay Raj",
      role: "CTO (Chief Technology Officer)",
      description: "Crafting innovative tech for education.",
      image: "/Images/akshay_pic.jpg",
      email: "akshay.kumar@kalawatiputra.com",
      linkedin: "https://www.linkedin.com/in/akshayraj1/",
      delay: "0.4s",
    },
    {
      name: "Ansh Sharma",
      role: "SVP/VP of Marketing",
      description: "Amplifying our reach with creative strategies.",
      image: "/Images/ansh_sharma_pic.jpg",
      email: "ansh.sharma@kalawatiputra.com",
      linkedin: "https://www.linkedin.com/in/ansh-sharma-84b93b293/",
      delay: "0.5s",
    },
    {
      name: "Aditya Raj",
      role: "Operations Team Lead",
      description: "Driving operational excellence and team efficiency.",
      image: "/Images/aditya_raj.jpeg",
      email: "aditya.raj@kalawatiputra.com",
      linkedin: "https://www.linkedin.com/in/rajaditya1/",
      delay: "0.6s",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <Toaster richColors />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Get In Touch</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Let's Build
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Together
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ready to transform your educational vision into reality? We're here to help you every step of the way.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Form - Takes 2 columns */}
          <div className="xl:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Send us a message</h2>
                    <p className="text-slate-400">We'd love to hear from you</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-slate-800/50 border ${formErrors.name ? "border-red-400/50" : "border-slate-600/50"
                          } rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                        placeholder="Your Name"
                        disabled={isLoading}
                      />
                      {formErrors.name && (
                        <p className="mt-2 text-red-400 text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-slate-800/50 border ${formErrors.email ? "border-red-400/50" : "border-slate-600/50"
                          } rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                        placeholder="abc@example.com"
                        disabled={isLoading}
                      />
                      {formErrors.email && (
                        <p className="mt-2 text-red-400 text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="6"
                      className={`w-full px-4 py-4 bg-slate-800/50 border ${formErrors.message ? "border-red-400/50" : "border-slate-600/50"
                        } rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 resize-none`}
                      placeholder="Tell us about your project, ideas, or how we can help you..."
                      disabled={isLoading}
                    ></textarea>
                    {formErrors.message && (
                      <p className="mt-2 text-red-400 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        {formErrors.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="group relative w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <span className="text-lg font-semibold">
                        {isLoading ? "Sending Message..." : "Send Message"}
                      </span>
                      {!isLoading && (
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      )}
                      {isLoading && (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Contact */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Quick Contact</h3>
                </div>
                <div className="space-y-4">
                  <a
                    href="tel:+919507152651"
                    className="group flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
                      <Phone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">+91-9507152651</p>
                      <p className="text-slate-400 text-sm">Call us anytime</p>
                    </div>
                  </a>
                  <a
                    href="mailto:ceo@kalawatiputra.com"
                    className="group flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">contact@kalawatiputra.com</p>
                      <p className="text-slate-400 text-sm">Drop us a line</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Office Locations */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Our Offices</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-semibold">Kondapur, Hyderabad</p>
                      <p className="text-slate-400 text-sm">500084 - Main Office</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-semibold">Bettiah, West Champaran</p>
                      <p className="text-slate-400 text-sm">845438, Bihar - Regional Office</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Follow Us</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href="https://x.com/kalawatiputra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 bg-slate-700/50 group-hover:bg-slate-600/50 rounded-xl flex items-center justify-center transition-colors duration-300">
                      <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </div>
                    <span className="text-slate-400 text-xs font-medium">Twitter</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/kalawatiputraedu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 bg-slate-700/50 group-hover:bg-slate-600/50 rounded-xl flex items-center justify-center transition-colors duration-300">
                      <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                      </svg>
                    </div>
                    <span className="text-slate-400 text-xs font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="https://www.instagram.com/kalawati.putra/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 bg-slate-700/50 group-hover:bg-slate-600/50 rounded-xl flex items-center justify-center transition-colors duration-300">
                      <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <span className="text-slate-400 text-xs font-medium">Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Our Team</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Meet the
            </span>{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Visionaries
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Our passionate team at KalawatiPutra Edu is dedicated to driving educational innovation and excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className={`relative group transform transition-all duration-700 ${teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              style={{ transitionDelay: member.delay }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6 text-center group-hover:shadow-2xl group-hover:shadow-emerald-500/20 transition-all duration-500">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-1 mx-auto overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-2xl object-cover bg-slate-800 transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-emerald-400 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {member.description}
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="w-10 h-10 bg-slate-800/50 hover:bg-emerald-500/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800/50 hover:bg-emerald-500/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 text-slate-350 hover:text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;