import React from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';

const ReviewsSection = ({ rating, reviewCount }) => {
    // Mock reviews to display (since we don't have real reviews in DB yet)
    const mockReviews = [
        {
            name: "Rajesh Kumar",
            date: "2 days ago",
            rating: 5,
            comment: "Excellent stay! Very close to the temple and the staff was very helpful. Rooms were clean and hygienic.",
            helpful: 12
        },
        {
            name: "Suresh Reddy",
            date: "1 week ago",
            rating: 4,
            comment: "Good value for money. The location is the best part, just walkable distance to the main entrance.",
            helpful: 8
        },
        {
            name: "Priya Sharma",
            date: "2 weeks ago",
            rating: 5,
            comment: "Safe place for families. Hot water was available 24/7 as promised. Will definitely visit again.",
            helpful: 15
        }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-soft mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Guest Reviews
                <span className="text-sm font-normal text-gray-500">({reviewCount} verified reviews)</span>
            </h2>

            {/* Overall Rating */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-1">{rating}</div>
                    <div className="flex gap-1 justify-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={16}
                                className={`${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">Overall Rating</p>
                </div>

                <div className="flex-1 h-16 border-l border-gray-200 pl-6 flex flex-col justify-center">
                    <p className="text-gray-700 font-medium italic">"Most guests highlighted the convenient location and cleanliness"</p>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {mockReviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-orange-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                    <p className="text-xs text-gray-500">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={14}
                                        className={`${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {review.comment}
                        </p>
                        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                            <ThumbsUp size={12} />
                            Helpful ({review.helpful})
                        </button>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 text-primary-600 font-medium text-sm hover:bg-primary-50 rounded-xl transition-colors">
                View All {reviewCount} Reviews
            </button>
        </div>
    );
};

export default ReviewsSection;
