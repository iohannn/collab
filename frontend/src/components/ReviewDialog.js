import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import { InteractiveStarRating, ReviewCard } from './TopInfluencers';
import { Star, MessageSquare, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ReviewDialog = ({ 
  open, 
  onOpenChange, 
  application, 
  collaboration, 
  onReviewSubmitted 
}) => {
  const { t, language } = useLanguage();
  const { getAuthHeaders } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error(language === 'ro' ? 'Te rugăm să selectezi un rating' : 'Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          application_id: application.application_id,
          rating,
          comment: comment || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to submit review');
      }

      toast.success(language === 'ro' 
        ? 'Recenzie trimisă! Va fi vizibilă când ambele părți vor trimite recenzia.' 
        : 'Review submitted! It will be visible when both parties submit their review.');
      onOpenChange(false);
      onReviewSubmitted?.();
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {language === 'ro' ? 'Lasă o recenzie' : 'Leave a Review'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ro' 
              ? `Evaluează experiența ta cu ${application?.influencer_name || collaboration?.brand_name}`
              : `Rate your experience with ${application?.influencer_name || collaboration?.brand_name}`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Trust Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              {language === 'ro' 
                ? 'Recenzia ta va fi dezvăluită simultan cu cea a celeilalte părți, sau după 14 zile.'
                : 'Your review will be revealed simultaneously with the other party\'s, or after 14 days.'}
            </span>
          </div>

          {/* Collaboration Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">{language === 'ro' ? 'Colaborare' : 'Collaboration'}</p>
            <p className="font-semibold">{collaboration?.title}</p>
          </div>

          {/* Rating */}
          <div>
            <Label className="mb-3 block">{language === 'ro' ? 'Rating' : 'Rating'}</Label>
            <div className="flex justify-center py-4">
              <InteractiveStarRating value={rating} onChange={setRating} />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {rating === 1 && (language === 'ro' ? 'Slab' : 'Poor')}
              {rating === 2 && (language === 'ro' ? 'Acceptabil' : 'Fair')}
              {rating === 3 && (language === 'ro' ? 'Bun' : 'Good')}
              {rating === 4 && (language === 'ro' ? 'Foarte bun' : 'Very Good')}
              {rating === 5 && (language === 'ro' ? 'Excelent' : 'Excellent')}
            </p>
          </div>

          {/* Comment */}
          <div>
            <Label>{language === 'ro' ? 'Comentariu (opțional)' : 'Comment (optional)'}</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={language === 'ro' 
                ? 'Spune-ne mai multe despre experiența ta...'
                : 'Tell us more about your experience...'
              }
              rows={3}
              className="mt-2"
              data-testid="review-comment"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || rating === 0}
              className="bg-primary text-primary-foreground"
              data-testid="submit-review"
            >
              {submitting 
                ? (language === 'ro' ? 'Se trimite...' : 'Submitting...') 
                : (language === 'ro' ? 'Trimite recenzia' : 'Submit Review')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const PendingReviewsBanner = () => {
  const { language } = useLanguage();
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const [pendingReviews, setPendingReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingReviews();
    }
  }, [isAuthenticated]);

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch(`${API}/reviews/pending`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPendingReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch pending reviews:', error);
    }
  };

  if (pendingReviews.length === 0) return null;

  return (
    <>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-800">
              {language === 'ro' 
                ? `Ai ${pendingReviews.length} recenzii de trimis`
                : `You have ${pendingReviews.length} reviews to submit`
              }
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              {language === 'ro'
                ? 'Ajută comunitatea cu feedback-ul tău!'
                : 'Help the community with your feedback!'
              }
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {pendingReviews.slice(0, 3).map((item) => (
                <Button
                  key={item.application.application_id}
                  size="sm"
                  variant="outline"
                  className="bg-white"
                  onClick={() => {
                    setSelectedReview(item);
                    setDialogOpen(true);
                  }}
                  data-testid={`review-pending-${item.application.application_id}`}
                >
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {item.collaboration.title.substring(0, 20)}...
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedReview && (
        <ReviewDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          application={selectedReview.application}
          collaboration={selectedReview.collaboration}
          onReviewSubmitted={() => {
            fetchPendingReviews();
            setSelectedReview(null);
          }}
        />
      )}
    </>
  );
};

export const ReviewsSection = ({ reviews, avgRating, reviewCount }) => {
  const { language } = useLanguage();

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          {language === 'ro' ? 'Recenzii' : 'Reviews'}
        </h3>
        {avgRating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-xl font-bold">{avgRating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} {language === 'ro' ? 'recenzii' : 'reviews'})
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.review_id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewDialog;
