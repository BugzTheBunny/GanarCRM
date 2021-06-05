from django.contrib.auth.models import User
from django.db import models
from django.db.models import fields
from rest_framework import serializers
from .models import Team


class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name"
        )


class TeamSerializer(serializers.Serializer):

    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = (
            "id",
            "name",
            "members"
        )
