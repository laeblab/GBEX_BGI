from rest_framework import serializers, viewsets
from .models import Location, Box, Vial


class LocationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Location
		fields = '__all__'


class BoxSerializer(serializers.ModelSerializer):
	class Meta:
		model = Box
		fields = '__all__'


"""  This was an alternative vial serializer that was nested, but its difficult to make it read/write
vial_serializer = type(
	"VialSerializer",
	(serializers.HyperlinkedModelSerializer,), {
		**{x.get_accessor_name(): type(f"{x.get_accessor_name()}_serializer", (serializers.ModelSerializer,), {
			"responsible": serializers.SlugRelatedField(slug_field='username', read_only=True),
			"Parent": serializers.SlugRelatedField(slug_field='name', read_only=True),
			"Meta": type(f"{x.get_accessor_name()}_serializer.Meta", (), {
				"model": x.related_model,
				"fields": "__all__"
			})})(many=True) for x in Vial._meta.get_fields() if x.many_to_many},
		"Meta": type("VialSerializer.Meta", (), {
			"ref_name": "readonlyVial",
			"fields": ['url', 'label', 'description', 'parent', 'box_row', 'box_column'] + [x.get_accessor_name() for x in Vial._meta.get_fields() if x.many_to_many]
		}
	)})
"""


class VialSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Vial
		fields = ['url', 'label', 'description', 'parent', 'box_row', 'box_column'] + [x.get_accessor_name() for x in Vial._meta.get_fields() if x.many_to_many]
		extra_kwargs = {
			x.get_accessor_name(): {'required': False} for x in Vial._meta.get_fields() if x.many_to_many
		}


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
