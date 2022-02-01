from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, filters
from .models import Lead
from team.models import Team
from .serializers import LeadSerializer
from rest_framework.pagination import PageNumberPagination


class LeadPagination(PageNumberPagination):
    page_size = 4


class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    queryset = Lead.objects.all()
    pagination_class = LeadPagination
    filter_backends = (filters.SearchFilter,)
    search_fields = ('company', 'contact_person')

    def perform_create(self, serializer):
        team = Team.objects.filter(members__in=[self.request.user]).first()
        serializer.save(team=team, created_by=self.request.user)

    def perform_update(self, serializer):
        obj = self.get_object()

        member_id = self.request.data['assigned_to']

        if member_id:
            user = User.objects.get(pk=member_id)
            serializer.save(assigned_to=user)
        else:
            serializer.save()

    def get_queryset(self):
        team = Team.objects.filter(members__in=[self.request.user]).first()
        return self.queryset.filter(team=team)
