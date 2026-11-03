"""
Views for HR Square Academy Review API.
Clean endpoints for public listing, submission, and summary metrics.
No public delete or update operations allowed.
"""

from django.db.models import Avg, Count
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle, AnonRateThrottle
from rest_framework.pagination import PageNumberPagination

from .models import Review
from .serializers import ReviewSerializer, ReviewSummarySerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 30

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })


class ReviewListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/reviews/         - List reviews (newest first, paginated)
    POST /api/reviews/         - Submit a new review (validated and rate-limited)
    """
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    pagination_class = StandardResultsSetPagination

    def get_throttles(self):
        if self.request.method == 'POST':
            # Rate limit write requests to prevent spam
            self.throttle_scope = 'reviews_post'
            return [ScopedRateThrottle()]
        return [AnonRateThrottle()]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Optional filter by reviewer_type (e.g. ?type=Parent or ?type=Student)
        reviewer_type = request.query_params.get('type')
        if reviewer_type and reviewer_type.capitalize() in ['Parent', 'Student']:
            queryset = queryset.filter(reviewer_type=reviewer_type.capitalize())

        # Optional filter by course
        course = request.query_params.get('course')
        if course:
            queryset = queryset.filter(course__iexact=course)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'status': 'success',
                'message': 'Review submitted successfully and is now publicly visible.',
                'review': serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class ReviewSummaryView(APIView):
    """
    GET /api/reviews/summary/  - Returns total review count and average rating
    """
    throttle_classes = [AnonRateThrottle]

    def get(self, request, *args, **kwargs):
        aggregates = Review.objects.aggregate(
            total=Count('id'),
            avg_rating=Avg('rating')
        )
        total = aggregates['total'] or 0
        avg_rating = round(float(aggregates['avg_rating']), 1) if aggregates['avg_rating'] else 0.0

        # Calculate breakdown for 1 to 5 stars
        breakdown_counts = (
            Review.objects.values('rating')
            .annotate(count=Count('id'))
        )
        breakdown = {str(i): 0 for i in range(1, 6)}
        for item in breakdown_counts:
            breakdown[str(item['rating'])] = item['count']

        data = {
            'total_reviews': total,
            'average_rating': avg_rating,
            'rating_breakdown': breakdown
        }
        serializer = ReviewSummarySerializer(data)
        return Response(serializer.data)
