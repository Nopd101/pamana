from django.urls import path
from .views import RegisterView, SubmitScoreView, TeacherDashboardView, UserProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Auth Routes
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # App Routes
    path('submit-score/', SubmitScoreView.as_view(), name='submit_score'),
    path('teacher-dashboard/', TeacherDashboardView.as_view(), name='teacher_dashboard'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
]