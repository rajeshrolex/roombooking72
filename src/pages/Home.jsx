import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Phone,
    MessageCircle,
    Star,
    Shield,
    Clock,
    Users,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import LodgeCard from '../components/lodge/LodgeCard';
import { lodges, getAvailableLodges, spiritualGreetings, mainContact } from '../data/mockData';

const heroImages = [
    'https://images.unsplash.com/photo-1609947017136-9c7fbb5cd4f5?w=1200&q=80',  // Orange temple
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80',  // Indian temple
    'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80'   // Temple sunset
];

const Home = () => {
    const availableLodges = getAvailableLodges();
    const walkableLodges = lodges.filter(l => l.distanceType === 'walkable');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-scroll hero images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    };

    const features = [
        {
            icon: Shield,
            title: 'Verified Lodges',
            description: 'All private lodges are verified for quality and safety'
        },
        {
            icon: Clock,
            title: 'Instant Booking',
            description: '24/7 booking with instant confirmation'
        },
        {
            icon: Users,
            title: 'Elder Friendly',
            description: 'Simple booking process for all age groups'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Hero Section with Background Carousel */}
            <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
                {/* Background Image Carousel */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={heroImages[currentSlide]}
                                alt="Mantralayam Temple"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            {/* Dark Overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Carousel Navigation Arrows */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Carousel Dots */}
                <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/70'
                                }`}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-24 flex flex-col justify-center min-h-[500px] sm:min-h-[600px] md:min-h-[700px]">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8 md:mb-12"
                    >
                        {/* Spiritual Greetings */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-yellow-200 text-xs sm:text-sm md:text-base font-medium mb-3 sm:mb-4 tracking-wide flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0"
                        >
                            <span>{spiritualGreetings.primary}</span>
                            <span className="hidden sm:inline mx-3">•</span>
                            <span>{spiritualGreetings.secondary}</span>
                        </motion.div>

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-white/30"
                        >
                            <span className="text-lg">🙏</span>
                            Only Private Lodges • No Mutt Lodges
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg px-2">
                            Rooms Near{' '}
                            <span className="text-yellow-300">Sri Raghavendra Swamy Mutt</span>
                        </h1>
                        <h2 className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium mb-2 drop-shadow-md">
                            Mantralayam
                        </h2>
                        <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto drop-shadow-md px-4">
                            Book comfortable private lodges for your spiritual journey. Easy booking, verified stays, affordable prices.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto w-full">
                        <SearchBar variant="hero" />
                    </div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-8 mt-6 sm:mt-8 text-white/90"
                    >
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full">
                            <Star className="text-yellow-300 fill-yellow-300" size={16} />
                            <span className="text-xs sm:text-sm md:text-base">4.5+ Rated</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full">
                            <MapPin size={16} />
                            <span className="text-xs sm:text-sm md:text-base">Near Temple</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full">
                            <Users size={16} />
                            <span className="text-xs sm:text-sm md:text-base">10,000+ Devotees</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Emergency Contact Bar */}
            <section className="bg-white py-4 border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <span className="text-gray-600 text-sm">Need urgent booking?</span>
                        <div className="flex items-center gap-3">
                            <a
                                href={`tel:${mainContact.replace(/\s/g, '')}`}
                                className="btn-call text-sm py-2"
                            >
                                <Phone size={16} />
                                Call Now
                            </a>
                            <a
                                href={`https://wa.me/${mainContact.replace(/[^0-9]/g, '')}?text=Hi, I need urgent booking in Mantralayam`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp text-sm py-2"
                            >
                                <MessageCircle size={16} />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-soft"
                            >
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="text-primary-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Walking Distance Lodges */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="section-title">Walking Distance from Mutt</h2>
                            <p className="section-subtitle">Lodges within 500m from Sri Raghavendra Swamy Mutt</p>
                        </div>
                        <Link
                            to="/lodges?distance=walkable"
                            className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                        >
                            View All
                            <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {walkableLodges.slice(0, 3).map((lodge, index) => (
                            <LodgeCard key={lodge.id} lodge={lodge} index={index} />
                        ))}
                    </div>

                    <Link
                        to="/lodges?distance=walkable"
                        className="sm:hidden flex items-center justify-center gap-1 text-primary-600 hover:text-primary-700 font-medium mt-6"
                    >
                        View All Walking Distance Lodges
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Today's Available Rooms */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="section-title">Today's Available Rooms</h2>
                            <p className="section-subtitle">Book now for instant confirmation</p>
                        </div>
                        <Link
                            to="/lodges"
                            className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                        >
                            View All Lodges
                            <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableLodges.slice(0, 6).map((lodge, index) => (
                            <LodgeCard key={lodge.id} lodge={lodge} index={index} />
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link
                            to="/lodges"
                            className="btn-primary inline-flex"
                        >
                            Explore All Lodges
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            Planning Your Visit to Mantralayam?
                        </h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                            Book your stay in advance and enjoy a peaceful pilgrimage.
                            We have the best private lodges near the temple.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/lodges" className="btn-primary w-full sm:w-auto">
                                Find Perfect Lodge
                            </Link>
                            <a
                                href={`https://wa.me/${mainContact.replace(/[^0-9]/g, '')}?text=Hi, I'm planning to visit Mantralayam and need help with booking`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp w-full sm:w-auto"
                            >
                                <MessageCircle size={20} />
                                Get Help on WhatsApp
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
