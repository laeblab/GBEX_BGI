from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path, include, re_path

from rest_framework import routers, permissions
from drf_yasg2.views import get_schema_view
from drf_yasg2 import openapi

from decorator_include import decorator_include

from GBEX_app.drf import GBEX_API_ViewSets
from GBEX_bigfiles.views import download_file
from GBEX_storage.drf import Storage_API

router = routers.DefaultRouter()
for name, viewset in [*GBEX_API_ViewSets, *Storage_API]:
	router.register(name, viewset)

schema_view = get_schema_view(
	openapi.Info(
		title="GBEX API",
		default_version="v1"
	),
	public=False,
	permission_classes=(permissions.IsAuthenticated,),
)

# generally views that are used to log the user in or has its own authentication machinery needs to be here
urlpatterns = [
	re_path('swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
	path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
	path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
	path('resumable_upload', include('GBEX_bigfiles.urls')),
	path('admin/', admin.site.urls),
	path('accounts/', include('django.contrib.auth.urls')),
	path('api/', include(router.urls)),
	path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
	path('downloads/<model>/<inst_name>/<filename>', download_file, name='download_url'),
	path('storage/', decorator_include(login_required, 'GBEX_storage.urls')),
	path('', decorator_include(login_required, 'GBEX_app.urls')),
]
