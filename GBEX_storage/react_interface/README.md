# BUGS
Mini skrift når jeg går in på storage...mærkeligt
Kan ikke oprette loc på root fordi loc/box kun kan oprettes på eksisterende loc

#Instructions
Add to app list in settings
Add url path('storage/', decorator_include(login_required, 'GBEX_storage.urls')),
Add drf stuff in GBEX/urls

ATT:
  DU HAR ÆNDRET SETTINGS static/url!!!
  Nogle urls er hardcoded til 127.0.0.1 for dev reasons

# Todo Next
[ ] metode til at redigere box size
[ ] herefter er det tid til vial assign

# Todo
* metode til vial display/assign
  * der skal kunne vælges flere brønde på en gang
    * drag select
    * shift/ctrl select??
  * hvis vials er selected
    * hvis 1 vial skal der hentes info via API og hvis det er et batch objekt, så skal parent nok også vises
    * vis assign objekt:
      * liste med godkendte modeller (maybe alle Inventory children)
        * ved valg i liste, hente liste over "model type" instances og vis i searchable liste (måske brug autocomplete light)
        * assign bør ideelt set ske via API...men det er måske svært
* GBEX_app interaktion
  * I list view, via Location column/field, skal man kunne tilgå GBEX_storage. Evt. links til storage der åbner box og selecter well
  * En måde at finde ledige positions?


# rememberings
Tree-modules
  MIU doesnt support drag/drop YET, so I dropped it.
  Now testing PrimeReact
  * Alternatives:
    * Ant Design (ant.design)
    * frontend-collective (https://github.com/frontend-collective/react-sortable-tree)
    * tree (https://github.com/react-component/tree)
