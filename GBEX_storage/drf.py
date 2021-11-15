from rest_framework import serializers, viewsets, permissions
from .models import Location, Box, Vial


class LocationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Location
		fields = '__all__'


class BoxSerializer(serializers.ModelSerializer):
	class Meta:
		model = Box
		fields = '__all__'


class VialSerializer(serializers.ModelSerializer):
	class Meta:
		model = Vial
		fields = '__all__'


class LocationViewSet(viewsets.ModelViewSet):
	queryset = Location.objects.all()
	serializer_class = LocationSerializer
	permission_classes = [permissions.IsAuthenticated]
	filter_fields = '__all__'


class BoxViewSet(viewsets.ModelViewSet):
	queryset = Box.objects.all()
	serializer_class = BoxSerializer
	permission_classes = [permissions.IsAuthenticated]
	filter_fields = '__all__'


class VialViewSet(viewsets.ModelViewSet):
	queryset = Vial.objects.all()
	serializer_class = VialSerializer
	permission_classes = [permissions.IsAuthenticated]
	filter_fields = '__all__'


Storage_API = [("Location", LocationViewSet), ("Box", BoxViewSet), ("Vial", VialViewSet)]
