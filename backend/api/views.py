from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, ActivityLog, Section
from .serializers import UserSerializer, ActivityLogSerializer

# [cite_start]1. Registration View [cite: 77]
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
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

# [cite_start]3. Teacher Dashboard View [cite: 54]
# Returns list of students and their progress for the logged-in teacher
class TeacherDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Ensure user is a teacher
        if request.user.role != 'teacher':
            return Response({"error": "Unauthorized"}, status=403)

        # [cite_start]Get sections assigned to this teacher [cite: 21]
        my_sections = Section.objects.filter(teacher=request.user)
        
        # Get students in those sections
        students = User.objects.filter(section__in=my_sections, role='student')
        
        data = []
        for student in students:
            # Get latest activities for this student
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
        serializer = UserSerializer(request.user)
        return Response(serializer.data)