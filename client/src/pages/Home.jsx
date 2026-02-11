import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Phone,
    MessageCircle,
    Shield,
    Clock,
    Users,
    ChevronRight,
    Loader2
} from 'lucide-react';
import LodgeCard from '../components/lodge/LodgeCard';
import { lodgeAPI } from '../services/api';
import { mainContact } from '../data/mockData';

// Hero images - you can replace these with your actual images
const heroImages = [
    '/hero1.png',
    '/hero2.png',
    '/hero3.png'
];

const Home = () => {
    const [lodges, setLodges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fetch lodges from API
    useEffect(() => {
        const fetchLodges = async () => {
            try {
                setLoading(true);
                const data = await lodgeAPI.getAll();
                setLodges(data);
            } catch (error) {
                console.error('Error fetching lodges:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLodges();
    }, []);

    // Filter lodges
    const availableLodges = lodges.filter(l => l.availability === 'available' || l.availability === 'limited');
    const walkableLodges = lodges.filter(l => l.distanceType === 'walkable');

    // Auto-scroll images every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

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
            {/* Hero Section with Image Slider */}
            <section className="relative h-[500px] md:h-[600px] overflow-hidden">
                {/* Background Image - Plain slide, no animation */}
                <div className="absolute inset-0">
                    <img
                        src={heroImages[currentSlide]}
                        alt="Mantralayam Temple"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Slide indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentSlide
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/70'
                                }`}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6 border border-white/30">
                            <span className="text-lg">🙏</span>
                            Bhakta Nivas • Only Private Lodges
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                            Rooms Near{' '}
                            <span className="text-orange-300">Sri Raghavendra Swamy Mutt</span>
                        </h1>
                        <h2 className="text-xl md:text-2xl text-white/90 font-medium mb-4">
                            Mantralayam
                        </h2>
                        <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8">
                            Book comfortable private lodges for your spiritual journey.
                        </p>

                        {/* CTA Button */}
                        <Link to="/lodges" className="btn-primary inline-flex text-lg px-8 py-3">
                            Browse Lodges
                            <ChevronRight size={20} />
                        </Link>
                    </div>
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
