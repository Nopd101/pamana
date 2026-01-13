from django.db import migrations

def create_sections(apps, schema_editor):
    Section = apps.get_model('api', 'Section')
    sections = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E', 
                'Section F', 'Section G', 'Section H', 'Section I', 'Section J']
    
    for name in sections:
        Section.objects.get_or_create(name=name)

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_create_default_admin'), # Adjust dependency if needed
    ]

    operations = [
        migrations.RunPython(create_sections),
    ]