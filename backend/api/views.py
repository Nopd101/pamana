from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from django.db.models import Q
from .models import User, ActivityLog, Section
from .serializers import UserSerializer, ActivityLogSerializer, SectionSerializer

# [cite_start]1. Registration View [cite: 77]
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = []
    permission_classes = [permissions.AllowAny] # Allow anyone to sign up

# [cite_start]2. Submit Score View [cite: 51]
# Frontend calls this when a student finishes a game/quiz
class SubmitScoreView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['student'] = request.user.id # Auto-assign to logged-in user
        serializer = ActivityLogSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 3. Teacher Dashboard View
class TeacherDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Ensure user is a teacher
        if user.role != 'teacher':
            return Response({"error": "Unauthorized"}, status=403)

        # FIX: Get sections where this user is the assigned teacher 
        # OR the section assigned to their user profile
        my_sections = Section.objects.filter(
            Q(teacher=user) | Q(id=user.section_id)
        ).distinct()

        # Get students belonging to these sections
        students = User.objects.filter(section__in=my_sections, role='student')

        data = []
        for student in students:
            # Get latest activities
            activities = ActivityLog.objects.filter(student=student).values()

            data.append({
                "id": student.id,
                "name": f"{student.first_name} {student.last_name}",
                "section": student.section.name if student.section else "N/A",
                "activities": list(activities)
            })

        return Response(data)
    
# 4. User Profile View (To get current user details)
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        data = serializer.data
        
        # 🛡️ FAILSAFE: If the user is a Django Superuser, override role to 'admin'
        # This fixes accounts created via 'createsuperuser' command
        if user.is_superuser:
            data['role'] = 'admin'
            
        return Response(data)
    
# 5. List Sections View
class SectionListView(generics.ListAPIView):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    # Add this line to ignore invalid tokens
    authentication_classes = []
    permission_classes = [permissions.AllowAny] # Allow unauthenticated users to see sections
    
# 6. Admin User Management View
class AdminUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited by Admins only.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser] # Strictly for Admins

    def create(self, request, *args, **kwargs):
        # Custom create logic to handle password hashing automatically via serializer
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Save user logic
        user = serializer.save()
        
        # If section IDs are passed (e.g. for students), handle linking
        # For teachers, we might need a Many-to-Many field for sections in the future
        # For now, let's assume the basic UserSerializer handles the single 'section' field
        pass
    
# 7. Admin Dashboard Stats View
class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        inactive_users = User.objects.filter(is_active=False).count()
        total_sections = Section.objects.count()

        return Response({
            "totalUsers": total_users,
            "activeUsers": active_users,
            "inactiveUsers": inactive_users,
            "totalSections": total_sections
        })