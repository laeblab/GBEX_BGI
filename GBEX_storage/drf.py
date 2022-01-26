from rest_framework import serializers, viewsets
from .models import Location, Box, Vial


class LocationSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Location
		fields = '__all__'


class BoxSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Box
		fields = '__all__'


class VialSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Vial
		fields = ['label', 'description', 'parent', 'box_row', 'box_column'] + [x.get_accessor_name() for x in Vial._meta.get_fields() if x.many_to_many]


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
