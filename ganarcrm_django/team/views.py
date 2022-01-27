from venv import create
from rest_framework import viewsets
from .models import Team
from .serializers import TeamSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()

    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        obj = serializer.save(created_by=self.request.user)
        obj.members.add(self.request.user)
        obj.save()


@api_view(['GET'])
def get_my_team(request):
    team = Team.objects.filter(created_by=request.user).first()
    serialzer = TeamSerializer(team)

    return Response(serialzer.data)
