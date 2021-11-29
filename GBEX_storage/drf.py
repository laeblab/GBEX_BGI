from rest_framework import serializers, viewsets, permissions
from .models import Location, Box, Vial
from GBEX_app.drf import GBEX_API_ViewSets
from generic_relations.relations import GenericRelatedField


class LocationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Location
		fields = '__all__'


class BoxSerializer(serializers.ModelSerializer):
	class Meta:
		model = Box
		fields = '__all__'


linkable_models = ['AntiGenBodyBatch', 'CellLineBatch','CultureMediaBatch','gRNA','PlasmidBatch','Primers','StrainBatch','Toxins']


class VialSerializer(serializers.ModelSerializer):
	content_object = GenericRelatedField({mo: vi.serializer_class() for mo, vi in GBEX_API_ViewSets.items()})# if x[0] in linkable_models})

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
