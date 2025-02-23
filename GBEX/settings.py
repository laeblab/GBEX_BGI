from pathlib import Path
from os import environ
from logging import getLogger
from urllib.parse import urljoin

from ldap import OPT_X_TLS_REQUIRE_CERT, OPT_X_TLS_NEVER, SCOPE_SUBTREE
from django_auth_ldap.config import LDAPSearch, GroupOfNamesType

BASE_DIR = Path(__file__).resolve().parent.parent

ADD_REVERSION_ADMIN = True  # Django Reversion
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
SECRET_KEY = environ.get('SECRET_KEY')
ALLOWED_HOSTS = environ.get('DOMAIN').split(",")

if environ.get('DEV_PROD') == 'local_dev':
	DEBUG = True
	CSRF_COOKIE_SECURE = False
	SESSION_COOKIE_SECURE = False
	SENDFILE_BACKEND = 'sendfile.backends.development'
elif environ.get('DEV_PROD') == 'docker_dev':
	DEBUG = True
	CSRF_COOKIE_SECURE = False
	SESSION_COOKIE_SECURE = False
	SENDFILE_BACKEND = 'sendfile.backends.nginx'
else:
	DEBUG = False
	CSRF_COOKIE_SECURE = True
	SESSION_COOKIE_SECURE = True
	SENDFILE_BACKEND = 'sendfile.backends.nginx'

# login stuff
LOGIN_URL = '/accounts/login/'
LOGOUT_REDIRECT_URL = '/'

AUTH_LDAP_GLOBAL_OPTIONS = {OPT_X_TLS_REQUIRE_CERT: OPT_X_TLS_NEVER,}  # AIT uses a self-signed certificate, so certificate authentication is not possible

AUTH_LDAP_BIO_SERVER_URI = "ldaps://win.dtu.dk"
AUTH_LDAP_BIO_USER_DN_TEMPLATE = 'CN=%(user)s,OU=BIO,OU=DTUBaseUsers,DC=win,DC=dtu,DC=dk'
AUTH_LDAP_BIO_USER_ATTR_MAP = {"first_name": "givenName", "last_name": "sn", 'email': 'mail'}
AUTH_LDAP_BIO_BIND_AS_AUTHENTICATING_USER = True
AUTH_LDAP_BIO_GROUP_SEARCH = LDAPSearch("ou=SecurityGroups,ou=BIO,ou=DTUBasen,dc=win,dc=dtu,dc=dk",SCOPE_SUBTREE, "(objectClass=groupOfNames)")
AUTH_LDAP_BIO_GROUP_TYPE = GroupOfNamesType()
AUTH_LDAP_BIO_REQUIRE_GROUP = 'CN=BIO-MBT-g-Biotherapeutic-Glycoeng-Immunology-41518,OU=SecurityGroups,OU=BIO,OU=DTUBasen,DC=win,DC=dtu,DC=dk'

AUTH_LDAP_STUDENT_SERVER_URI = "ldaps://win.dtu.dk"
AUTH_LDAP_STUDENT_USER_DN_TEMPLATE = 'cn=%(user)s,ou=STUDENTS,ou=DTUBaseUsers,dc=win,dc=dtu,dc=dk'
AUTH_LDAP_STUDENT_USER_ATTR_MAP = {"first_name": "givenName", "last_name": "sn", 'email': 'mail'}
AUTH_LDAP_STUDENT_BIND_AS_AUTHENTICATING_USER = True
AUTH_LDAP_STUDENT_GROUP_SEARCH = LDAPSearch("ou=SecurityGroups,ou=BIO,ou=DTUBasen,dc=win,dc=dtu,dc=dk",SCOPE_SUBTREE, "(objectClass=groupOfNames)")
AUTH_LDAP_STUDENT_GROUP_TYPE = GroupOfNamesType()
AUTH_LDAP_STUDENT_REQUIRE_GROUP = 'CN=BIO-MBT-g-Biotherapeutic-Glycoeng-Immunology-41518,OU=SecurityGroups,OU=BIO,OU=DTUBasen,DC=win,DC=dtu,DC=dk'

#AUTH_LDAP_STUDENTMsc_SERVER_URI = "ldaps://win.dtu.dk"
#AUTH_LDAP_STUDENTMsc_USER_DN_TEMPLATE = 'cn=%(user)s,ou=STUDENTS,ou=DTUBaseUsers,dc=win,dc=dtu,dc=dk'
#AUTH_LDAP_STUDENTMsc_USER_ATTR_MAP = {"first_name": "givenName", "last_name": "sn", 'email': 'mail'}
#AUTH_LDAP_STUDENTMsc_BIND_AS_AUTHENTICATING_USER = True
#AUTH_LDAP_STUDENTMsc_GROUP_SEARCH = LDAPSearch("ou=SecurityGroups,ou=BIO,ou=DTUBasen,dc=win,dc=dtu,dc=dk",ldap.SCOPE_SUBTREE, "(objectClass=groupOfNames)")
#AUTH_LDAP_STUDENTMsc_GROUP_TYPE = GroupOfNamesType()
#AUTH_LDAP_STUDENTMsc_REQUIRE_GROUP = 'CN=BIO-PSBT-BGI-students-44259,OU=SecurityGroups,OU=BIO,OU=DTUBasen,DC=win,DC=dtu,DC=dk'

LDAP_BGI_STUDENT_SERVER_URI = "ldaps://win.dtu.dk"
LDAP_BGI_STUDENT_USER_DN_TEMPLATE = 'cn=%(user)s,ou=STUDENTS,ou=DTUBaseUsers,dc=win,dc=dtu,dc=dk'
LDAP_BGI_STUDENT_USER_ATTR_MAP = {"first_name": "givenName", "last_name": "sn", 'email': 'mail'}
LDAP_BGI_STUDENT_BIND_AS_AUTHENTICATING_USER = True
LDAP_BGI_STUDENT_GROUP_SEARCH = LDAPSearch("ou=SecurityGroups,ou=BIO,ou=DTUBasen,dc=win,dc=dtu,dc=dk",SCOPE_SUBTREE, "(objectClass=groupOfNames)")
LDAP_BGI_STUDENT_GROUP_TYPE = GroupOfNamesType()
LDAP_BGI_STUDENT_REQUIRE_GROUP = 'CN=BIO-MBT-BGI-students-44259,OU=SecurityGroups,OU=BIO,OU=DTUBasen,DC=win,DC=dtu,DC=dk'


AUTHENTICATION_BACKENDS = (
	'django.contrib.auth.backends.ModelBackend',
	"GBEX.ldap_backends.LDAPBIOBackend",
	"GBEX.ldap_backends.LDAPStudentBackend",
	"GBEX.ldap_backends.LDAPBGIStudentGround",
)

INSTALLED_APPS = [
	#"corsheaders",  # delete. Just here for react development
	'dal',
	'dal_select2',
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'crispy_forms',
	'reversion',
	'reversion_compare',
	'widget_tweaks',
	'rest_framework',
	'rest_framework.authtoken',
	'django_filters',
	'GBEX_app.apps.GbexAppConfig',
	'GBEX_bigfiles.apps.GbexBigfilesConfig',
	'GBEX_storage.apps.GbexStorageConfig',
	'drf_spectacular',
]

#CORS_ALLOW_ALL_ORIGINS = True  # delete. Just here for react development
#CORS_ALLOW_CREDENTIALS = True  # delete. Just here for react development


MIDDLEWARE = [
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	#"corsheaders.middleware.CorsMiddleware",  # delete. Just for react developtment
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'reversion.middleware.RevisionMiddleware',
]

ROOT_URLCONF = 'GBEX.urls'

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': ['templates'],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
			'libraries': {
				'laeb_tags': 'GBEX_app.template_tags.tags',
			},
		},
	},
]

WSGI_APPLICATION = 'GBEX.wsgi.application'

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql',  # postgresql is, as far as I know, the only django supported db that has json fields
		'NAME': environ.get('DB_NAME'),
		'USER': environ.get('DB_USER'),
		'PASSWORD': environ.get('POSTGRES_PASSWORD'),
		'HOST': environ.get('DB_HOST'),
	},
}

AUTH_PASSWORD_VALIDATORS = [
	{'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
	{'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
	{'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
	{'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Europe/Copenhagen'
USE_I18N = False
USE_TZ = True
DATE_FORMAT = 'c'
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / "shared/static"
STATICFILES_DIRS = (BASE_DIR / "static",)
SENDFILE_ROOT = MEDIA_ROOT = environ.get('UPLOAD_PERMANENT_LOCATION')
SENDFILE_URL = "/protected"

RESUMABLE_SUBDIR = 'resumable_chunks/'
MEDIA_URL = ''  # This is the default value and I just have it because I use it for resumable storage in case I want to change it

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
	"RESUMABLE_STORAGE": {
		"BACKEND": "django.core.files.storage.FileSystemStorage",
		"OPTIONS": {
			"location": Path(MEDIA_ROOT) / RESUMABLE_SUBDIR,
			"base_url": urljoin(MEDIA_URL, RESUMABLE_SUBDIR),
		},
	},
}


CACHES = {
	'default': {
		'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
		'LOCATION': '127.0.0.1:11211',
	}
}

REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': (
		'rest_framework.authentication.TokenAuthentication',
		'rest_framework.authentication.SessionAuthentication',
	),
	'DEFAULT_PERMISSION_CLASSES': (
		'rest_framework.permissions.IsAuthenticated',
		#'rest_framework.permissions.AllowAny',
	),
	'DEFAULT_FILTER_BACKENDS': ['django_ufilter.integrations.drf.DRFFilterBackend',], #'django_filters.rest_framework.DjangoFilterBackend']
	'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
	'TITLE': 'GBEX API',
	'DESCRIPTION': 'GoodBye EXcel',
	'VERSION': '1.0.0',
	'SERVE_INCLUDE_SCHEMA': False,
	'SERVE_PUBLIC': False,
	'SERVE_PERMISSIONS': ['rest_framework.permissions.IsAuthenticated'],
}

# logging setup
log = getLogger(__name__)
min_level = 'WARNING'
min_django_level = 'WARNING'

# logging dictConfig configuration
LOGGING = {
	'version': 1,
	'disable_existing_loggers': False,  # keep Django's default loggers
	'formatters': {
		# see full list of attributes here:
		# https://docs.python.org/3/library/logging.html#logrecord-attributes
		'verbose': {
			'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
		},
		'simple': {
			'format': '%(levelname)s %(message)s'
		},
		'timestampthread': {
			'format': "%(asctime)s [%(threadName)-12.12s] [%(levelname)-5.5s] [%(name)-20.20s]  %(message)s",
		},
	},
	'handlers': {
		'logfile': {
			# optionally raise to INFO to not fill the log file too quickly
			'level': min_level,  # this level or higher goes to the log file
			'class': 'logging.handlers.RotatingFileHandler',
			'filename': f'{environ.get("LOG_ROOT")}/django.log',
			'maxBytes': 50 * 10 ** 6,  # will 50 MB do?
			'backupCount': 3,  # keep this many extra historical files
			'formatter': 'timestampthread'
		},
		'console': {
			'level': min_level,  # this level or higher goes to the console
			'class': 'logging.StreamHandler',
		},
	},
	'loggers': {
		'django': {  # configure all of Django's loggers
			'handlers': ['logfile', 'console'],
			'level': min_django_level,
			'propagate': False,
		},
		'': {
			'handlers': ['logfile', 'console'],
			'level': min_level,
		},
	},
}

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
