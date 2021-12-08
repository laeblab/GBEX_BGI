from rest_framework import serializers, viewsets, permissions
from .models import Location, Box, Vial
from GBEX_app.drf import GBEX_API_ViewSets
from generic_relations.relations import GenericRelatedField
from GBEX_app.models.Inventory import AntiGenBodyBatch, CellLineBatch, CultureMediaBatch, PlasmidBatch, StrainBatch, gRNA, Primers, Toxins


class LocationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Location
		fields = '__all__'


class BoxSerializer(serializers.ModelSerializer):
	class Meta:
		model = Box
		fields = '__all__'


linkable_models = [AntiGenBodyBatch, CellLineBatch, CultureMediaBatch, PlasmidBatch, StrainBatch, gRNA, Primers, Toxins]


class VialSerializer(serializers.ModelSerializer):
	content_object = GenericRelatedField({
			#mo: vi.serializer_class() for mo, vi in GBEX_API_ViewSets.items()
			model: type(f"{model.__name__}Serializer", (serializers.HyperlinkedModelSerializer,), {
				"responsible": serializers.SlugRelatedField(slug_field='username', read_only=True),
				**{key: serializers.SlugRelatedField(slug_field='name', read_only=True) for key in ['Parent'] if hasattr(model, 'Parent')},
				"Meta": type(f"{model.__name__}Serializer.Meta", (), {"model": model, "fields": "__all__"})})() for model in linkable_models
	})# if x[0] in linkable_models})

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
