from rest_framework import serializers, viewsets
from .models import Location, Box, Vial
from generic_relations.relations import GenericRelatedField


class LocationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Location
		fields = '__all__'


class BoxSerializer(serializers.ModelSerializer):
	class Meta:
		model = Box
		fields = '__all__'


class VialSerializer(serializers.ModelSerializer):
	content_object = GenericRelatedField({
			model: type(f"{model.__name__}Serializer", (serializers.HyperlinkedModelSerializer,), {
				"responsible": serializers.SlugRelatedField(slug_field='username', read_only=True),
				**{
					key: type(f"{model.Parent.field.related_model.__name__}Serializer", (serializers.ModelSerializer,),
							  {"Meta": type(f"{model.Parent.field.related_model.__name__}Serializer.Meta", (), {
								  "model": model.Parent.field.related_model, "fields": "__all__"})}
					)(read_only=True) for key in ['Parent'] if (hasattr(model, 'Parent') and model.model_kind == 'GBEX_Batch')
				},
				"Meta": type(f"{model.__name__}Serializer.Meta", (), {"model": model, "fields": "__all__"})})() for model in Vial.linkable_models
	})# if x[0] in linkable_models})

	class Meta:
		model = Vial
		fields = '__all__'


class LocationViewSet(viewsets.ModelViewSet):
	queryset = Location.objects.all()
	serializer_class = LocationSerializer
	filter_fields = '__all__'


class BoxViewSet(viewsets.ModelViewSet):
	queryset = Box.objects.all()
	serializer_class = BoxSerializer
	filter_fields = '__all__'


class VialViewSet(viewsets.ModelViewSet):
	queryset = Vial.objects.all()
	serializer_class = VialSerializer
	filter_fields = '__all__'


Storage_API = [("Location", LocationViewSet), ("Box", BoxViewSet), ("Vial", VialViewSet)]
