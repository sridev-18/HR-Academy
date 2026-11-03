"""
Serializers for HR Square Academy Review API.
Includes strict validation and input sanitization to ensure data integrity.
"""

import html
import re
from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id',
            'reviewer_name',
            'reviewer_type',
            'course',
            'rating',
            'review_text',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_reviewer_name(self, value):
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        if len(cleaned) > 100:
            raise serializers.ValidationError("Name cannot exceed 100 characters.")
        # Strip potential HTML injection
        cleaned = re.sub(r'<[^>]*>', '', cleaned)
        return cleaned

    def validate_reviewer_type(self, value):
        allowed = [choice[0] for choice in Review.ReviewerType.choices]
        if value not in allowed:
            raise serializers.ValidationError(
                f"Invalid reviewer type '{value}'. Allowed: {', '.join(allowed)}."
            )
        return value

    def validate_course(self, value):
        allowed = [choice[0] for choice in Review.CourseChoice.choices]
        if value not in allowed:
            raise serializers.ValidationError(
                f"Invalid course '{value}'. Allowed: {', '.join(allowed)}."
            )
        return value

    def validate_rating(self, value):
        if not isinstance(value, int) or value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be an integer between 1 and 5.")
        return value

    def validate_review_text(self, value):
        cleaned = value.strip()
        if len(cleaned) < 20:
            raise serializers.ValidationError("Review text must be at least 20 characters long.")
        if len(cleaned) > 1000:
            raise serializers.ValidationError("Review text cannot exceed 1000 characters.")
        # Strip potential HTML injection
        cleaned = re.sub(r'<[^>]*>', '', cleaned)
        return cleaned


class ReviewSummarySerializer(serializers.Serializer):
    """Serializer for aggregate review metrics."""
    total_reviews = serializers.IntegerField()
    average_rating = serializers.FloatField()
    rating_breakdown = serializers.DictField(child=serializers.IntegerField(), required=False)
