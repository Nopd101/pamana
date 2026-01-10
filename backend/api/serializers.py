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
        # Ensure 'is_active' is included so you can soft-delete/reactivate
        fields = ['id', 'username', 'first_name', 'last_name', 'role', 'section', 'section_name', 'password', 'is_active']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        # 1. Securely hash the password upon creation
        # We use create_user instead of create to handle hashing automatically
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        # 2. Extract password from data if it exists
        password = validated_data.pop('password', None)
        
        # 3. Update all other fields (first_name, role, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # 4. CRITICAL: If a password was provided, HASH IT before saving
        if password and len(password.strip()) > 0:
            instance.set_password(password)
            
        instance.save()
        return instance

class ActivityLogSerializer(serializers.ModelSerializer):
    # [cite_start]Used for tracking progress and scores [cite: 6]
    class Meta:
        model = ActivityLog
        fields = '__all__'