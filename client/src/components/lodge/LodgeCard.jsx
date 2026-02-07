import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Star,
    MapPin,
    Phone,
    MessageCircle,
    Wifi,
    Car,
    Droplets,
    Wind,
    Zap
} from 'lucide-react';

const LodgeCard = ({ lodge, index = 0 }) => {
    const {
        id,
        name,
        slug,
        images,
        distance,
        distanceType,
        rating,
        reviewCount,
        priceStarting,
        availability,
        amenities
    } = lodge;

    const getAvailabilityBadge = () => {
        switch (availability) {
            case 'available':
                return <span className="badge-available">Available</span>;
            case 'limited':
                return <span className="badge-limited">Limited Rooms</span>;
            case 'full':
                return <span className="badge-full">Fully Booked</span>;
            default:
                return null;
        }
    };

    const getDistanceBadge = () => {
        return (
            <span className={`badge-distance ${distanceType === 'walkable' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                <MapPin size={12} className="mr-1" />
                {distance} • {distanceType === 'walkable' ? 'Walking distance' : 'Auto distance'}
            </span>
        );
    };

    const amenityIcons = {
        wifi: Wifi,
        parking: Car,
        hotWater: Droplets,
        ac: Wind,
        powerBackup: Zap
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="card group"
        >
            {/* Image Section */}
            <div className="relative overflow-hidden aspect-[4/3]">
                <img
                    src={images[0]}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Availability Badge */}
                <div className="absolute top-3 left-3">
                    {getAvailabilityBadge()}
                </div>

                {/* Distance Badge */}
                <div className="absolute top-3 right-3">
                    {getDistanceBadge()}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Trusted Badge - Show for high rated lodges */}
                {rating >= 4.5 && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md text-xs font-bold shadow-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Star size={10} className="fill-current" />
                        Trusted by Devotees
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Title & Rating */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Link to={`/lodge/${slug}`}>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg flex-shrink-0">
                        <Star size={14} className="text-green-600 fill-green-600" />
                        <span className="text-sm font-semibold text-green-700">{rating}</span>
                    </div>
                </div>

                {/* Reviews */}
                <p className="text-sm text-gray-500 mb-3">
                    {reviewCount} reviews
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {amenities.slice(0, 4).map((amenity) => {
                        const IconComponent = amenityIcons[amenity];
                        return IconComponent ? (
                            <span key={amenity} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                <IconComponent size={12} />
                            </span>
                        ) : null;
                    })}
                    {amenities.length > 4 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            +{amenities.length - 4} more
                        </span>
                    )}
                </div>

                {/* Price & Actions */}
                <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500">Starting from</p>
                        <p className="text-xl font-bold text-gray-900">
                            ₹{priceStarting}
                            <span className="text-sm font-normal text-gray-500">/night</span>
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href={`tel:${lodge.phone}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Call Now"
                        >
                            <Phone size={20} />
                        </a>
                        <a
                            href={`https://wa.me/${lodge.whatsapp?.replace(/[^0-9]/g, '')}?text=Hi, I want to book a room at ${name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="WhatsApp"
                        >
                            <MessageCircle size={20} />
                        </a>
                        <Link
                            to={`/lodge/${slug}`}
                            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            View
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LodgeCard;
