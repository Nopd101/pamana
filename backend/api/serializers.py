from rest_framework import serializers
from .models import User, Section, ActivityLog

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'name', 'teacher']

class UserSerializer(serializers.ModelSerializer):
    # This serializer handles User Profile data
    section_name = serializers.CharField(source='section.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'role', 'section', 'section_name', 'password', 'is_active'] # Added is_active to allow deactivation via API
        extra_kwargs = {'password': {'write_only': True, 'required': False}} # Password not required on update

    def create(self, validated_data):
        # Securely hash the password upon creation
        user = User.objects.create_user(**validated_data)
        return user

    # 👇 ADD THIS METHOD to fix the bug
    def update(self, instance, validated_data):
        # Extract password from data if it exists
        password = validated_data.pop('password', None)
        
        # Update all other fields (first_name, role, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # If a password was provided, hash it using set_password()
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance

class ActivityLogSerializer(serializers.ModelSerializer):
    # [cite_start]Used for tracking progress and scores [cite: 6]
    class Meta:
        model = ActivityLog
        fields = '__all__'