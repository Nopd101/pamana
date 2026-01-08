from django.contrib import admin
from .models import User, Section, ActivityLog

# This makes these tables visible in the Admin Panel
admin.site.register(User)
admin.site.register(Section)
admin.site.register(ActivityLog)