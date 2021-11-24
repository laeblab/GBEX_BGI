from rest_framework import serializers, viewsets, permissions
from .models import Location, Box, Vial
from GBEX_app.models.Inventory import StrainBatch, CellLineBatch, PlasmidBatch
from GBEX_app.drf import GBEX_API_ViewSets


class LocationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Location
		fields = '__all__'


class BoxSerializer(serializers.ModelSerializer):
	class Meta:
		model = Box
		fields = '__all__'


class VialRelatedField(serializers.RelatedField):
	def get_queryset(self):
		print(self)
		return StrainBatch.objects.all()

	def to_representation(self, value):
		print(value)
		if isinstance(value, StrainBatch):
			#serializer = BookmarkSerializer(value)
			return "Strain: " + value.name
		elif isinstance(value, CellLineBatch):
			return "Cell: " + value.name
			#serializer = NoteSerializer(value)
		elif isinstance(value, PlasmidBatch):
			return [x for x in GBEX_API_ViewSets if x[0].lower() == 'plasmidbatch'][0][1].serializer_class(value).data
			#return "plasbas: " + value.name
		else:
			raise Exception('Unexpected type of object', value)

		#return serializer.data


class VialSerializer(serializers.ModelSerializer):
	content_object = VialRelatedField()

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
