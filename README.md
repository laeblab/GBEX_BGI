# GBEX - Goodbye Excel: A MetaDataStore and more

# TODO
* [ ] Check up on requirements.txt in regards to Django 4 compatability of several components
* [ ] Recreate Django app to get latest default settings.py
* [ ] Reactivate security after development finishes.
* [ ] Create tests

# Long todo
* [ ] Update to Bootstrap 5 (maybe get rid of jquery or at least upgrade to latest) or consider switching to primereact
* [ ] Consider switching to django channels

# DTU BGI Instance  
To deploy with LDAP support remember to install
* libsasl2-dev  
* libldap2-dev  


### What is this?
This is a system for replacing excel based registration sheets with a web-based database backed solution.  
It uses Django as the backend and a custom REACT based frontend.   
You setup database models and then the system should be able to understand that and create GUI and API access to them.

### Quickstart
docker-compose up -d  
After docker finishes you should create a superuser  
docker exec -ti -u worker gbex_gbex_1 python manage.py createsuperuser  
  
Then you should be able to visit:
   1) Main page: http://localhost
   2) DRF API: http://localhost/api
   3) OpenAPI swagger: http://localhost/swagger
   4) OpenAPI redoc: http://localhost/redoc

### Docs (work in progress):
"Custom instance changes" aka "What you need to do run your own GBEX":
  * Nearly all changes of a custom GBEX instance should be made to "GBEX_app/models"
  * Also the (hidden) files .env and .env_not_docker may need to be adjusted  

There are a few base models that should to be used:
* Profile in "GBEX_app/models/models.py"
  * This model is used to attach a required "table_settings" json object that is used by the frontend to save personalized user settings
* BaseOption
  * This is a model used to store controlled dictionaries.
  * In a GBEXModelBase model, you can have a foreignkey to a BaseOption model and then it will enable autocomplete, search and create options if you use the widgets
* GBEXModelBase in "GBEX_app/models/models.py"
  * This is an abstract model that most other models should inherit
  * It has the following fields that are required by all frontend displayed models:
    * name: This is intended as a non-editable unique human understandable identifier
    * responsible: A link to the USER that created this object
	* created: automatic field with creation date
	* edited: automatic field with edit date
	* archived: Archived objects are not send to the frontend (still accessible in admin interface)
	* order: This object is used to determine which fields should be displayed and in which order
	* symbol: By default, "name" is generated by using "symbol" and adding a number. E.g. Symbol is "PL", then the first object will be "PL1", second object will be "PL2"
	* col_display_func_dict: Most fields have a great default display function, but sometimes you may want to customize it. Almost always the case for many2many objects
	* widgets: By default django default widgets are used, but you may want to used another, e.g. for autocompletes for foreignkeys using django-autocomplete-light
	* model_kind: Currently this can be:
	   * GBEX_Page: This indicates that this is a frontend item
	   * GBEX_Option: This is for a user controlled dictionary. A GBEX_Page model linked field (foreignkey/manytomany) where the user can add items.
	   * GBEX_Batch: If a GBEX_Page model has batches enabled then this is that model =) 
	* col_html_string: By default the react based frontend will just show a string, but columns in this list will be displayed as HTML e.g. to create hyperlinks
	* col_read_only: By default the GUI will attempt to get an edit widget from the backend, but not for columns in this list. Effectively this means that the frontend can't edit these fields.
	* Warning about setting "Unique=True" on a field:
	  * With field with Unique=True you cant directly use the "Number of new items" feature on the model create page.
	  * If you want Unique=True AND to be able to use the "Number of new items", then you need to edit "GBEXCreateView" in GBEX_app/views.py to check the unique constraint before saving and if it fails then provide a solution, e.g. a function to generate a unique entry. 
* Menus are generated by "links" in GBEX_app/template_tags/tags.py 
  * It uses the "menu_label" attribute of models with "model_kind" == "GBEX_Page"


### Changelog
* (next) changed API to hyperlinked models
* (03/05/2021) Reverted bulk edit code.
* (21/08/2020) Fixed bugs with row selection functions when too many rows were selected
* (21/08/2020) Fixed various minor bugs in bulk edit
* (15/07/2020) Added Batch concept
* (14/07/2020) Archive feature: Implemented. It simply hides archived items on list pages. They can still be linked and found in link searches.
* (14/07/2020) Added User model to the REST API

### Todos
* Move models col_display_func_dict into helpers.field_to_string for many2many fields
* Make a custom thing to check on delete whether object is used in Many-to-many relation and if so, prevent deletion
* Inform frontend how to sort each column (numbers/dates/strings)
* Give frontend a "nice name" for columns

### Considerations
* (04-05-2021) Born from a desire to upgrade to React 17 and Bootstrap 4, I took a deep dive.  
  * I found that react 17 is blocked by react-virtualized. A PR is ready, but for some reason not merged...  
  * I then wanted to update the build system and doing that caused me to evaluate typescript and create react app 
    * It always takes some time to get back into JS development due to the complexity of the dev/build environment 
	  with webpack, eslint, babel, etc. So I took a look a "create react app" and through that also typescript.  
	  While its certainly easier to set things up with cra, it also came with some head scratching.  
	  I solved it, but as far as I tell, it doesn't really offer much after I have already done the work of setting up
	  a build system.
	  Typescript looks nice, and I would probably choose it over flow today, but again it doesn't seem to offer any
	  substantial reward.
  * I will keep an eye on react-virtualized and see if they move forward in the next year. If not, I will probably
	investigate an alternative table solution.