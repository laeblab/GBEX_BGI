from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework import routers
from decorator_include import decorator_include

from GBEX_app.drf import GBEX_API_ViewSets
from GBEX_bigfiles.views import download_file
from GBEX_storage.drf import Storage_API

router = routers.DefaultRouter()
for name, viewset in [*[(mo.__name__, vi) for mo, vi in GBEX_API_ViewSets.items()], *Storage_API]:
	router.register(name, viewset)


# generally views that are used to log the user in or has its own authentication machinery needs to be here
urlpatterns = [
	path('resumable_upload', include('GBEX_bigfiles.urls')),
	path('admin/', admin.site.urls),
	path('accounts/', include('django.contrib.auth.urls')),
	path('api/', include(router.urls)),
	path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
	path('downloads/<model>/<inst_name>/<filename>', download_file, name='download_url'),
	#path('storage/', decorator_include(login_required, 'GBEX_storage.urls')),
	path('storage/', include('GBEX_storage.urls')),
	path('', decorator_include(login_required, 'GBEX_app.urls')),
	#API
	path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
	path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
	path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
	path('eln/', include('GBEX_eln.urls')),
]
