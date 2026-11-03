"""
Unit and integration tests for HR Square Academy Review API.
Tests model constraints, serializer validation, and REST API endpoints.
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Review

class ReviewAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.list_url = reverse('review-list-create')
        self.summary_url = reverse('review-summary')

    def test_empty_reviews_list(self):
        """GET /api/reviews/ returns empty results and count 0 initially."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)
        self.assertEqual(len(response.data['results']), 0)

    def test_empty_summary(self):
        """GET /api/reviews/summary/ returns total_reviews=0 and average_rating=0.0."""
        response = self.client.get(self.summary_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_reviews'], 0)
        self.assertEqual(response.data['average_rating'], 0.0)

    def test_create_valid_review_parent(self):
        """POST /api/reviews/ successfully saves a parent review."""
        payload = {
            'reviewer_name': 'Karthik Subramanian',
            'reviewer_type': 'Parent',
            'course': 'Vedic Maths',
            'rating': 5,
            'review_text': 'My daughter improved her calculation speed significantly within 3 months.'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['review']['reviewer_name'], 'Karthik Subramanian')
        self.assertEqual(Review.objects.count(), 1)

    def test_create_valid_review_student(self):
        """POST /api/reviews/ successfully saves a student review."""
        payload = {
            'reviewer_name': 'Karani V S',
            'reviewer_type': 'Student',
            'course': 'Abacus',
            'rating': 5,
            'review_text': 'I won 1st position in the State Level Championship thanks to the mentors!'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)

    def test_summary_calculation(self):
        """GET /api/reviews/summary/ accurately calculates totals and averages."""
        Review.objects.create(
            reviewer_name='Parent One',
            reviewer_type='Parent',
            course='Abacus',
            rating=5,
            review_text='Outstanding coaching and individual attention for every child.'
        )
        Review.objects.create(
            reviewer_name='Parent Two',
            reviewer_type='Parent',
            course='Maths Tuition',
            rating=4,
            review_text='Great improvement in school board exam test performance.'
        )
        response = self.client.get(self.summary_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_reviews'], 2)
        self.assertEqual(response.data['average_rating'], 4.5)

    def test_validation_invalid_rating(self):
        """POST /api/reviews/ rejects ratings outside 1-5."""
        payload = {
            'reviewer_name': 'Test User',
            'reviewer_type': 'Parent',
            'course': 'Abacus',
            'rating': 6,
            'review_text': 'This is a valid length review text for testing purposes.'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rating', response.data)

    def test_validation_invalid_reviewer_type(self):
        """POST /api/reviews/ rejects invalid reviewer types."""
        payload = {
            'reviewer_name': 'Test User',
            'reviewer_type': 'Teacher',
            'course': 'Abacus',
            'rating': 5,
            'review_text': 'This is a valid length review text for testing purposes.'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('reviewer_type', response.data)

    def test_validation_invalid_course(self):
        """POST /api/reviews/ rejects unlisted courses."""
        payload = {
            'reviewer_name': 'Test User',
            'reviewer_type': 'Parent',
            'course': 'Unknown Course Name',
            'rating': 5,
            'review_text': 'This is a valid length review text for testing purposes.'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('course', response.data)

    def test_validation_short_review_text(self):
        """POST /api/reviews/ rejects review texts under 20 characters."""
        payload = {
            'reviewer_name': 'Test User',
            'reviewer_type': 'Parent',
            'course': 'Abacus',
            'rating': 5,
            'review_text': 'Too short'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('review_text', response.data)

    def test_html_sanitization(self):
        """Ensure potential script or HTML tags are stripped during validation."""
        payload = {
            'reviewer_name': '<script>alert("xss")</script>Anand',
            'reviewer_type': 'Parent',
            'course': 'Vedic Maths',
            'rating': 5,
            'review_text': '<b>Excellent</b> teaching methods and structured syllabus.'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created = Review.objects.get(id=response.data['review']['id'])
        self.assertNotIn('<script>', created.reviewer_name)
        self.assertNotIn('<b>', created.review_text)
