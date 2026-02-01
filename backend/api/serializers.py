from rest_framework import serializers
from .models import User, Section, ActivityLog
from django.contrib.auth import get_user_model

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'name', 'teacher']

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    section_name = serializers.CharField(source='section.name', read_only=True)
    
    # 👇 NEW: specific field to read/write multiple sections for teachers
    assigned_sections = serializers.SerializerMethodField()
    section_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'role', 'section', 'section_name', 
            'password', 'is_active', 
            'assigned_sections', 'section_ids' # Add new fields here
        ]
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    # 👇 Helper to get list of sections a teacher owns
    def get_assigned_sections(self, obj):
        if obj.role == 'teacher':
            return list(Section.objects.filter(teacher=obj).values_list('id', flat=True))
        return []

    def create(self, validated_data):
        # Extract section_ids list
        section_ids = validated_data.pop('section_ids', [])
        
        user = User.objects.create_user(**validated_data)
        
        # 👇 Assign teacher to multiple sections
        if user.role == 'teacher' and section_ids:
            Section.objects.filter(id__in=section_ids).update(teacher=user)
            
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        section_ids = validated_data.pop('section_ids', None) # Extract list

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password and len(password.strip()) > 0:
            instance.set_password(password)
            
        instance.save()

        # 👇 Logic to update Teacher's sections
        if instance.role == 'teacher' and section_ids is not None:
            # 1. Clear old sections (remove this teacher from them)
            Section.objects.filter(teacher=instance).update(teacher=None)
            # 2. Assign new sections
            Section.objects.filter(id__in=section_ids).update(teacher=instance)

        return instance

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__' # This automatically includes the new 'details' field