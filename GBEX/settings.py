import os
import logging

import django.core.cache.backends.memcached
import ldap
import rest_framework.permissions
from django_auth_ldap.config import LDAPSearch, GroupOfNamesType

ADD_REVERSION_ADMIN = True  # Django Reversion
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECRET_KEY = os.environ.get('SECRET_KEY')
ALLOWED_HOSTS = os.environ.get('DOMAIN').split(",")

if os.environ.get('DEV_PROD') == 'local_dev':
	DEBUG = True
	CSRF_COOKIE_SECURE = False
	SESSION_COOKIE_SECURE = False
	SENDFILE_BACKEND = 'sendfile.backends.development'
elif os.environ.get('DEV_PROD') == 'docker_dev':
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

AUTH_LDAP_GLOBAL_OPTIONS = {ldap.OPT_X_TLS_REQUIRE_CERT: ldap.OPT_X_TLS_NEVER,}  # AIT uses a self-signed certificate, so certificate authentication is not possible

AUTH_LDAP_BIO_SERVER_URI = "ldaps://win.dtu.dk"
AUTH_LDAP_BIO_USER_DN_TEMPLATE = 'CN=%(user)s,OU=BIO,OU=DTUBaseUsers,DC=win,DC=dtu,DC=dk'
AUTH_LDAP_BIO_USER_ATTR_MAP = {"first_name": "givenName", "last_name": "sn", 'email': 'mail'}
AUTH_LDAP_BIO_BIND_AS_AUTHENTICATING_USER = True
AUTH_LDAP_BIO_GROUP_SEARCH = LDAPSearch("ou=SecurityGroups,ou=BIO,ou=DTUBasen,dc=win,dc=dtu,dc=dk",ldap.SCOPE_SUBTREE, "(objectClass=groupOfNames)")
AUTH_LDAP_BIO_GROUP_TYPE = GroupOfNamesType()
AUTH_LDAP_BIO_REQUIRE_GROUP = 'CN=BIO-PSBT-g-Biotherapeutic-Glycoeng-Immunology-41518,OU=SecurityGroups,OU=BIO,OU=DTUBasen,DC=win,DC=dtu,DC=dk'

AUTH_LDAP_STUDENT_SERVER_URI = "ldaps://win.dtu.dk"
AUTH_LDAP_STUDENT_USER_DN_TEMPLATE = 'cn=%(user)s,ou=STUDENTS,ou=DTUBaseUsers,dc=win,dc=dtu,dc=dk'
AUTH_LDAP_STUDENT_USER_ATTR_MAP = {"first_name": "givenName", "last_name": "sn", 'email': 'mail'}
AUTH_LDAP_STUDENT_BIND_AS_AUTHENTICATING_USER = True
AUTH_LDAP_STUDENT_GROUP_SEARCH = LDAPSearch("ou=SecurityGroups,ou=BIO,ou=DTUBasen,dc=win,dc=dtu,dc=dk",ldap.SCOPE_SUBTREE, "(objectClass=groupOfNames)")
AUTH_LDAP_STUDENT_GROUP_TYPE = GroupOfNamesType()
AUTH_LDAP_STUDENT_REQUIRE_GROUP = 'CN=BIO-PSBT-g-Biotherapeutic-Glycoeng-Immunology-41518,OU=SecurityGroups,OU=BIO,OU=DTUBasen,DC=win,DC=dtu,DC=dk'

AUTHENTICATION_BACKENDS = (
	'django.contrib.auth.backends.ModelBackend',
	"GBEX.ldap_backends.LDAPBIOBackend", "GBEX.ldap_backends.LDAPStudentBackend"
)

INSTALLED_APPS = [
"corsheaders",  # delete. Just here for react development
	'dal',
	'dal_select2',
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'reversion',
	'reversion_compare',
	'widget_tweaks',
	'rest_framework',
	'rest_framework.authtoken',
	'drf_yasg2',
	'django_filters',
	'GBEX_app.apps.GbexAppConfig',
	'GBEX_bigfiles.apps.GbexBigfilesConfig',
	'GBEX_storage.apps.GbexStorageConfig',

]
CORS_ALLOW_ALL_ORIGINS = True  # delete. Just here for react development
CORS_ALLOW_CREDENTIALS = True  # delete. Just here for react development


MIDDLEWARE = [
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	"corsheaders.middleware.CorsMiddleware",  # delete
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
		'NAME': os.environ.get('DB_NAME'),
		'USER': os.environ.get('DB_USER'),
		'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
		'HOST': os.environ.get('DB_HOST'),
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
STATIC_ROOT = os.path.join(BASE_DIR, "shared/static")
STATICFILES_DIRS = (os.path.join(BASE_DIR, "static"),)
SENDFILE_ROOT = MEDIA_ROOT = os.environ.get('UPLOAD_PERMANENT_LOCATION')
SENDFILE_URL = "/protected"

CACHES = {
	'default': {
		'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
		'LOCATION': '127.0.0.1:11211',
	}
}

REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': (
	#	'rest_framework.authentication.TokenAuthentication',
	#	'rest_framework.authentication.SessionAuthentication',
	),
	'DEFAULT_PERMISSION_CLASSES': (
		#'rest_framework.permissions.IsAuthenticated',
		'rest_framework.permissions.AllowAny',
	),
	'DEFAULT_FILTER_BACKENDS': ['url_filter.integrations.drf.DjangoFilterBackend',] #'django_filters.rest_framework.DjangoFilterBackend']
}

# logging setup
log = logging.getLogger(__name__)
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
			'filename': f'{os.environ.get("LOG_ROOT")}/django.log',
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