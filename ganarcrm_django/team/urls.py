from django.conf.urls import url
from django.urls import path, include
from rest_framework import urlpatterns
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet

router = DefaultRouter()
router.register('leads', TeamViewSet, basename='teams')

urlpatterns = [
    path('', include(router.urls)),
]
