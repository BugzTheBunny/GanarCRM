from django.contrib.auth.models import User
from django.db import models
from django.db.models.base import Model
from django.db.models.deletion import CASCADE


class Lead():
    NEW = 'new'
    CONTACTED = 'contacted'
    INPROGRESS = 'inprogress'
    LOST = 'lost'
    WON = 'won'

    CHOICES_STATUS = (
        (NEW, 'New'),
        (CONTACTED, 'Contacted'),
        (INPROGRESS, 'Inprogress'),
        (LOST, 'Lost'),
        (WON, 'Won')
    )

    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'

    CHOICES_PRIORITY = (
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High')
    )

    company = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=255)
    website = models.CharField(max_length=255)
    confidence = models.IntegerField(blank=True, null=True)
    estimated_value = models.IntegerField(blank=True, null=True)
    status = models.CharField(
        max_length=25, choices=CHOICES_STATUS, default=NEW)
    priority = models.CharField(
        max_length=25, choices=CHOICES_PRIORITY, default=MEDIUM)
    created_by = models.ForeignKey(
        User, related_name='leads', on_delete=CASCADE)
    CREATED_AT = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
