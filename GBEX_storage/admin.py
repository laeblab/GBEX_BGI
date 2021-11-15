from django.contrib import admin
from reversion_compare.admin import CompareVersionAdmin
from .models import Location, Box, Vial


@admin.register(Location)
class LocationAdmin(CompareVersionAdmin):
    pass


@admin.register(Box)
class BoxAdmin(CompareVersionAdmin):
    pass


@admin.register(Vial)
class VialAdmin(CompareVersionAdmin):
    pass
