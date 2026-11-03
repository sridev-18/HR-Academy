from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'reviewer_name', 'reviewer_type', 'course', 'rating', 'created_at')
    list_filter = ('reviewer_type', 'course', 'rating')
    search_fields = ('reviewer_name', 'review_text')
    ordering = ('-created_at',)
