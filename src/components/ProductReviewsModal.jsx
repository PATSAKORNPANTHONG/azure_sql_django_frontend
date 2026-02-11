import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Trash2, Send } from 'lucide-react';
import { reviewService, contentFilterService } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { Loader2 } from 'lucide-react';

const StarRating = ({ rating, setRating, editable = false }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => editable && setRating(star)}
                    className={`focus:outline-none ${editable ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    disabled={!editable}
                >
                    <Star
                        size={editable ? 24 : 16}
                        className={`${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

export const ProductReviewsModal = ({ isOpen, onClose, product }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            fetchReviews();
        }
    }, [isOpen, product]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewService.getAll(product.id);
            setReviews(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // First, filter the comment
            const filterResponse = await contentFilterService.filterComment(newReview.comment);

            if (!filterResponse.is_safe) {
                alert('Your comment contains inappropriate language and has been filtered. Please review before submitting.');
                setNewReview({ ...newReview, comment: filterResponse.filtered });
                setSubmitting(false);
                return;
            }

            // If safe, proceed with creating the review using the filtered text (which should be same as original if safe)
            await reviewService.create({
                product_id: product.id,
                user_id: 1, // Hardcoded for demo
                rating: newReview.rating,
                comment: filterResponse.filtered || newReview.comment
            });
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            console.error(error);
            alert('Failed to add review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete review?')) return;
        try {
            await reviewService.delete(id);
            fetchReviews();
        } catch (e) { console.error(e); }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? `Reviews for ${product.name}` : 'Reviews'} className="max-w-2xl">
            <div className="space-y-6">
                {/* Review Form */}
                <form onSubmit={handleSubmit} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-4">
                    <h4 className="font-medium text-white mb-2">Write a Review</h4>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Share your thoughts..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-slate-400 mb-1">Rating</span>
                            <StarRating rating={newReview.rating} setRating={(r) => setNewReview({ ...newReview, rating: r })} editable />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" size="sm" isLoading={submitting}>
                            <Send size={16} className="mr-2" /> Post Review
                        </Button>
                    </div>
                </form>

                {/* Reviews List */}
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-4">
                    {loading ? <div className="text-center p-4"><Loader2 className="animate-spin inline text-primary" /></div> :
                        reviews.length === 0 ? <p className="text-center text-slate-500 py-4">No reviews yet. Be the first!</p> :
                            reviews.map(review => (
                                <div key={review._id} className="p-4 bg-slate-900/30 rounded-lg border border-slate-800 flex justify-between group">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <StarRating rating={review.rating} />
                                            <span className="text-xs text-slate-500 ml-2">{review.username || `User #${review.user_id}`}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 whitespace-pre-line">{review.comment}</p>
                                    </div>
                                    <button onClick={() => handleDelete(review._id)} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                    }
                </div>
            </div>
        </Modal>
    );
};
