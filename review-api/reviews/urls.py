"""
URL routing for reviews app.
"""

from django.urls import path
from .views import ReviewListCreateView, ReviewSummaryView

urlpatterns = [
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('reviews/summary/', ReviewSummaryView.as_view(), name='review-summary'),
]
