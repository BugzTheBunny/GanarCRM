# Generated by Django 4.0.1 on 2022-01-30 20:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('lead', '0003_lead_team'),
    ]

    operations = [
        migrations.AddField(
            model_name='lead',
            name='assigned_to',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assignedleads', to=settings.AUTH_USER_MODEL),
        ),
    ]