"""
Review model definition for HR Square Academy.
Stores verified parent and student feedback in PostgreSQL.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    class ReviewerType(models.TextChoices):
        PARENT = 'Parent', 'Parent'
        STUDENT = 'Student', 'Student'

    class CourseChoice(models.TextChoices):
        ABACUS = 'Abacus', 'Abacus'
        VEDIC_MATHS = 'Vedic Maths', 'Vedic Maths'
        WRITTEN_HINDI = 'Written Hindi', 'Written Hindi'
        SPOKEN_HINDI = 'Spoken Hindi', 'Spoken Hindi'
        MATHS_TUITION = 'Maths Tuition', 'Maths Tuition'

    # Auto-incrementing primary key
    id = models.BigAutoField(primary_key=True)

    reviewer_name = models.CharField(
        max_length=100,
        help_text="Full name of the parent or student"
    )

    reviewer_type = models.CharField(
        max_length=20,
        choices=ReviewerType.choices,
        help_text="Role: Parent or Student"
    )

    course = models.CharField(
        max_length=100,
        choices=CourseChoice.choices,
        help_text="Course attended by the learner"
    )

    rating = models.IntegerField(
        validators=[
            MinValueValidator(1, message="Rating must be at least 1 star."),
            MaxValueValidator(5, message="Rating cannot exceed 5 stars.")
        ],
        help_text="Star rating from 1 to 5"
    )

    review_text = models.TextField(
        help_text="Detailed written feedback (20 to 1000 characters)"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when the review was submitted"
    )

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['rating']),
            models.Index(fields=['reviewer_type']),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(rating__gte=1) & models.Q(rating__lte=5),
                name='check_valid_rating_range'
            ),
            models.CheckConstraint(
                condition=models.Q(reviewer_type__in=['Parent', 'Student']),
                name='check_valid_reviewer_type'
            ),
        ]

    def __str__(self):
        return f"{self.reviewer_name} ({self.reviewer_type}) - {self.course} [{self.rating}★]"
