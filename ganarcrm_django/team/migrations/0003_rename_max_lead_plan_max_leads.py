# Generated by Django 4.0.1 on 2022-02-03 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('team', '0002_plan_team_plan'),
    ]

    operations = [
        migrations.RenameField(
            model_name='plan',
            old_name='max_lead',
            new_name='max_leads',
        ),
    ]
