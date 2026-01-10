from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # [cite_start]Roles defined in Source 9 (Student, Teacher, Admin) [cite: 10, 11, 12]
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    
    # Students belong to a section
    section = models.ForeignKey('Section', on_delete=models.SET_NULL, null=True, blank=True, related_name="students")

    def __str__(self):
        return f"{self.username} ({self.role})"

class Section(models.Model):
    name = models.CharField(max_length=50)
    # 👇 ADD THIS FIELD
    teacher = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='teacher_sections',
        limit_choices_to={'role': 'teacher'}
    )

    def __str__(self):
        return self.name

class ActivityLog(models.Model):
    """
    Tracks scores for Quizzes and MiniGames
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities")
    civilization = models.CharField(max_length=50) # e.g., "Mesopotamia"
    activity_type = models.CharField(max_length=20) # "Quiz" or "Game"
    activity_name = models.CharField(max_length=100) # e.g., "Ziggurat Puzzle"
    score = models.IntegerField(default=0)
    max_score = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.activity_name}: {self.score}"