from django_auth_ldap.backend import LDAPBackend


class LDAPBIOBackend(LDAPBackend):
	settings_prefix = "AUTH_LDAP_BIO_"


class LDAPStudentBackend(LDAPBackend):
	settings_prefix = "AUTH_LDAP_STUDENT_"
