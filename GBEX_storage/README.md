# BUGS
Mini skrift når jeg går in på storage...mærkeligt
Kan ikke oprette loc på root fordi loc/box kun kan oprettes på eksisterende loc
chromium har vist problemer med drag and drop (check chrome på windows)

#Instructions for adding to vanilla GBEX
Add to app list in settings
Add url path('storage/', decorator_include(login_required, 'GBEX_storage.urls')),
Add drf stuff in GBEX/urls
Add a many2many field to Vial on the objects you want to be able to store


# Skift inden production
  DU HAR ÆNDRET SETTINGS static/url!!!
  Nogle urls er hardcoded til 127.0.0.1 for dev reasons
  Bunke cors settings for dev reasons


# Todo
  - Vial <-> gbex link
  - Tillad også at Vials uden link som bare er "description" 
* GBEX_app interaktion
  * I list view, via Location column/field, skal man kunne tilgå GBEX_storage. Evt. links til storage der åbner box og selecter well
  * En måde at finde ledige positions?
* Find måde hvor api url ikke er hardcoded i react