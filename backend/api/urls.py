from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, SubmitScoreView, TeacherDashboardView, 
    UserProfileView, SectionListView, AdminUserViewSet, # Import the new ViewSet
    AdminStatsView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Create a router for the viewsets
router = DefaultRouter()
router.register(r'users', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    # Auth Routes
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('sections/', SectionListView.as_view(), name='section_list'),

    # Admin Routes (Includes /users/, /users/<id>/)
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('admin/', include(router.urls)),

    # App Routes
    path('submit-score/', SubmitScoreView.as_view(), name='submit_score'),
    path('teacher-dashboard/', TeacherDashboardView.as_view(), name='teacher_dashboard'),
]