"""
URL configuration for review-api project.
"""

from django.urls import path, include

urlpatterns = [
    path('api/', include('reviews.urls')),
]
