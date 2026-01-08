from rest_framework import serializers
from .models import User, Section, ActivityLog

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'name', 'teacher']

class UserSerializer(serializers.ModelSerializer):
    # [cite_start]This serializer handles User Profile data [cite: 36, 64]
    section_name = serializers.CharField(source='section.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'role', 'section', 'section_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Securely hash the password upon creation
        user = User.objects.create_user(**validated_data)
        return user

class ActivityLogSerializer(serializers.ModelSerializer):
    # [cite_start]Used for tracking progress and scores [cite: 6]
    class Meta:
        model = ActivityLog
        fields = '__all__'