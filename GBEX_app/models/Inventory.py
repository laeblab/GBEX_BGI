from django.db import models
from django.urls import reverse_lazy, reverse
from django.forms import DateInput
from django.contrib.contenttypes.fields import GenericRelation

from dal import autocomplete

from GBEX_bigfiles.fields import ResumableFileField
from GBEX_app.helpers import get_upload_path
from GBEX_storage.models import Vial
from GBEX_storage.helpers import pos_to_coord

from .models import BaseOption, GBEXModelBase, AbstractBatch, default_order, default_widgets, default_readonly
from .LabDocuments import SOP

inventory_order = [*default_order, 'Usage']


class InventoryItem(GBEXModelBase):
	Usage = models.TextField(blank=True, null=True)
	menu_label = "Inventory"

	order = inventory_order

	class Meta:
		abstract = True


class AntibioticOption(BaseOption):
	pass


class Plasmid(InventoryItem):
	CommonName = models.TextField(blank=True, null=True)
	Genotype = models.TextField(blank=True, null=True)
	Antibiotic = models.ManyToManyField(AntibioticOption, blank=True)
	Genbank_file = ResumableFileField(blank=True, null=True, upload_to=get_upload_path, max_length=500)

	order = [*inventory_order, 'CommonName', 'Antibiotic', 'Genbank_file', 'Batches']
	symbol = "PL"
	col_display_func_dict = {
		'Batches': lambda item: f"<a href='{reverse('list_PlasmidBatch', kwargs=dict(parent_pk=item.pk))}'>{item.plasmidbatch_set.filter(archived=False).count()} batches</a>",
		'Genbank_file': lambda item: f"<a href='/downloads/{item.Genbank_file}'>{str(item.Genbank_file).split('/')[-1]}</a>",
		'Antibiotic': lambda item: ", ".join(ab.name for ab in item.Antibiotic.all()) if item.Antibiotic.all() else "",
	}

	col_html_string = ['Genbank_file', 'Batches']
	col_read_only = [*default_readonly, 'Batches']

	widgets = {
		**default_widgets,
		'Antibiotic': autocomplete.ModelSelect2Multiple(url=reverse_lazy('AntibioticOption-autocomplete')),
	}


class PlasmidBatch(AbstractBatch):
	Parent = models.ForeignKey(Plasmid, on_delete=models.PROTECT)
	Barcode = models.TextField(blank=True, null=True)
	Location = GenericRelation(Vial, related_query_name="PlasmidBatch")
	SequenceVerified = models.BooleanField(default=False)

	order = [*default_order, 'Location', 'Barcode', 'SequenceVerified', 'Parent']
	symbol = "PL_Batch"

	col_read_only = [*default_readonly, 'Parent', 'Location']
	col_html_string = ['Location']
	col_display_func_dict = {
		'Location': lambda item: ", ".join(
			f"{ab.parent.parent}:{ab.parent}:{pos_to_coord(ab.pos_index, ab.parent.columns)}" for ab in
			item.Location.all()) if item.Location.all() else "",
	}


class Primers(InventoryItem):
	Sequence = models.TextField(blank=True, null=True)
	Tm = models.PositiveIntegerField("Tm (°C)", blank=True, null=True)
	Conc = models.PositiveIntegerField("Conc (uM)", blank=True, null=True)
	Location = GenericRelation(Vial, related_query_name="Primers")

	order = [*inventory_order, "Sequence", 'Tm', 'Conc', "Location"]
	symbol = "PR"
	col_read_only = [*default_readonly, 'Location']
	col_html_string = ['Location']
	col_display_func_dict = {
		'Location': lambda item: ", ".join(
			f"{ab.parent.parent}:{ab.parent}:{pos_to_coord(ab.pos_index, ab.parent.columns)}" for ab in
			item.Location.all()) if item.Location.all() else "",
	}


class SpeciesOption(BaseOption):
	pass


class VendorOption(BaseOption):
	pass


class Strain(InventoryItem):
	CommonName = models.TextField(blank=True, null=True)
	Species = models.ForeignKey(SpeciesOption, on_delete=models.PROTECT)
	Subtype = models.TextField(blank=True, null=True)
	Antibiotic = models.ManyToManyField(AntibioticOption, blank=True)
	Genotype = models.TextField(blank=True, null=True)
	Vendor = models.ForeignKey(VendorOption, blank=True, null=True, on_delete=models.PROTECT)
	CatalogNo = models.TextField(blank=True, null=True)
	Plasmids = models.ManyToManyField(Plasmid, blank=True)
	ParentStrain = models.ForeignKey("self", null=True, blank=True, on_delete=models.PROTECT)
	Genbank_file = ResumableFileField(blank=True, null=True, upload_to=get_upload_path, max_length=500)

	order = [*inventory_order, 'CommonName', 'Species', 'Subtype', 'ParentStrain', 'Antibiotic', 'Genotype',
			 'Plasmids', 'Genbank_file', 'Vendor', 'CatalogNo', 'Batches']
	symbol = "ST"
	col_display_func_dict = {
		'Plasmids': lambda item: ", ".join(ab.name for ab in item.Plasmids.all()) if item.Plasmids.all() else "",
		'Antibiotic': lambda item: ", ".join(ab.name for ab in item.Antibiotic.all()) if item.Antibiotic.all() else "",
		'Batches': lambda item: f"<a href='{reverse('list_StrainBatch', kwargs=dict(parent_pk=item.pk))}'>{item.strainbatch_set.filter(archived=False).count()} batches</a>",
		'Genbank_file': lambda
			item: f"<a href='/downloads/{item.Genbank_file}'>{str(item.Genbank_file).split('/')[-1]}</a>",

	}
	widgets = {
		**default_widgets,
		'Species': autocomplete.ModelSelect2(url=reverse_lazy('SpeciesOption-autocomplete')),
		'Vendor': autocomplete.ModelSelect2(url=reverse_lazy('VendorOption-autocomplete')),
		'ParentStrain': autocomplete.ModelSelect2(url=reverse_lazy('Strain-autocomplete')),
		'Plasmids': autocomplete.ModelSelect2Multiple(url=reverse_lazy('Plasmid-autocomplete')),
		'Antibiotic': autocomplete.ModelSelect2Multiple(url=reverse_lazy('AntibioticOption-autocomplete')),
	}

	col_html_string = ['Genbank_file', 'Batches']
	col_read_only = [*default_readonly, 'Batches']


class StrainBatch(AbstractBatch):
	Parent = models.ForeignKey(Strain, on_delete=models.PROTECT)
	Location = GenericRelation(Vial, related_query_name="StrainBatch")
	Barcode = models.TextField(blank=True, null=True)
	TubesLeft = models.PositiveIntegerField(blank=True, null=True)

	order = [*default_order, 'TubesLeft', 'Barcode', 'Location', 'Parent']
	symbol = "ST_Batch"
	col_html_string = ['Location']
	col_display_func_dict = {
		'Location': lambda item: ", ".join(
			f"{ab.parent.parent}:{ab.parent}:{pos_to_coord(ab.pos_index, ab.parent.columns)}" for ab in
			item.Location.all()) if item.Location.all() else "",
	}
	col_read_only = [*default_readonly, 'Parent', 'Location']


class CellLine(InventoryItem):
	CommonName = models.TextField(blank=True, null=True)
	Species = models.ForeignKey(SpeciesOption, on_delete=models.PROTECT, blank=True, null=True)
	DeltaGenotype = models.TextField(blank=True, null=True)
	Parent = models.ForeignKey('self', blank=True, on_delete=models.PROTECT, null=True)
	CumulativeGenotype = models.TextField(blank=True, null=True)
	SOP = models.ForeignKey(SOP, blank=True, on_delete=models.PROTECT, null=True)

	order = [*inventory_order, 'CommonName', 'Species', 'Parent', 'DeltaGenotype', 'CumulativeGenotype', 'SOP', 'Batches']
	symbol = "CL"

	col_display_func_dict = {
		'SOP': lambda item: f"<a href='/downloads/{item.SOP.SOP_file}'>{item.SOP}</a>" if item.SOP else "",
		'Batches': lambda item: f"<a href='{reverse('list_CellLineBatch', kwargs=dict(parent_pk=item.pk))}'>{item.celllinebatch_set.filter(archived=False).count()} batches</a>",
	}

	widgets = {
		**default_widgets,
		'Species': autocomplete.ModelSelect2(url=reverse_lazy('SpeciesOption-autocomplete')),
		'Parent': autocomplete.ModelSelect2(url=reverse_lazy('CellLine-autocomplete')),
		'SOP': autocomplete.ModelSelect2(url=reverse_lazy('SOP-autocomplete')),
	}

	col_html_string = ['Batches', 'SOP']
	col_read_only = [*default_readonly, 'Batches']


class CellLineBatch(AbstractBatch):
	Parent = models.ForeignKey(CellLine, on_delete=models.PROTECT)
	Location = GenericRelation(Vial, related_query_name="CellLineBatch")
	Barcode = models.TextField(blank=True, null=True)
	TubesLeft = models.PositiveIntegerField(blank=True, null=True)
	Mycoplasma = models.DateField(blank=True, null=True)

	order = [*default_order, 'Location', 'Barcode', 'TubesLeft', 'Mycoplasma', 'Parent']
	symbol = "CL_Batch"

	col_read_only = [*default_readonly, 'Parent', 'Location']
	col_html_string = ['Location']

	widgets = {
		**default_widgets,
		"Mycoplasma": DateInput(attrs={'data-isdate': "yes"})
	}
	col_display_func_dict = {
		'Location': lambda item: ", ".join(f"{ab.parent.parent}:{ab.parent}:{pos_to_coord(ab.pos_index, ab.parent.columns)}" for ab in item.Location.all()) if item.Location.all() else "",
	}


class CultureMedia(InventoryItem):
	ProductName = models.TextField(blank=True, null=True)
	Vendor = models.ForeignKey(VendorOption, blank=True, null=True, on_delete=models.PROTECT)
	CatalogNo = models.TextField(blank=True, null=True)

	order = [*inventory_order, 'ProductName', 'Vendor', 'CatalogNo', 'Batches']
	symbol = "CM"

	widgets = {
		**default_widgets,
		'Vendor': autocomplete.ModelSelect2(url=reverse_lazy('VendorOption-autocomplete')),
	}
	col_display_func_dict = {
		'Batches': lambda item: f"<a href='{reverse('list_CultureMediaBatch', kwargs=dict(parent_pk=item.pk))}'>{item.culturemediabatch_set.filter(archived=False).count()} batches</a>",
	}

	col_html_string = ['Batches']
	col_read_only = [*default_readonly, 'Batches']


class CultureMediaBatch(AbstractBatch):
	Parent = models.ForeignKey(CultureMedia, on_delete=models.PROTECT)
	Location = GenericRelation(Vial, related_query_name="CultureMediaBatch")
	Barcode = models.TextField(blank=True, null=True)

	order = [*default_order, 'Location', 'Barcode', 'Parent']
	symbol = "CM_Batch"

	col_read_only = [*default_readonly, 'Parent', 'Location']
	col_html_string = ['Location']
	col_display_func_dict = {
		'Location': lambda item: ", ".join(f"{ab.parent.parent}:{ab.parent}:{pos_to_coord(ab.pos_index, ab.parent.columns)}" for ab in item.Location.all()) if item.Location.all() else "",
	}

class CRISPRoption(BaseOption):
	pass


class gRNA(InventoryItem):
	CRISPR_enzyme = models.ForeignKey(CRISPRoption, on_delete=models.PROTECT, blank=True, null=True)
	TargetSpecies = models.ForeignKey(SpeciesOption, on_delete=models.PROTECT, blank=True, null=True)
	TargetGenome = models.TextField(blank=True, null=True)
	TargetSequence = models.TextField(blank=True, null=True)
	FullOligoSequence = models.TextField(blank=True, null=True)
	TargetFwdPrimer = models.ForeignKey(Primers, on_delete=models.PROTECT, blank=True, null=True, related_name='gRNA_fwd_primer')
	TargetRevPrimer = models.ForeignKey(Primers, on_delete=models.PROTECT, blank=True, null=True, related_name='gRNA_rev_primer')
	PCRProduct = models.TextField(blank=True, null=True)
	Location = GenericRelation(Vial, related_query_name="gRNA")

	order = [*inventory_order, 'CRISPR_enzyme', 'TargetSpecies', 'TargetGenome', 'TargetSequence', 'FullOligoSequence', 'TargetFwdPrimer', 'TargetRevPrimer', 'PCRProduct', 'Location']
	symbol = "gRNA"
	col_read_only = [*default_readonly, 'Parent', 'Location']
	col_html_string = ['Location']
	col_display_func_dict = {
		'Location': lambda item: ", ".join(
			f"{ab.parent.parent}:{ab.parent}:{pos_to_coord(ab.pos_index, ab.parent.columns)}" for ab in
			item.Location.all()) if item.Location.all() else "",
	}
	widgets = {
		**default_widgets,
		'CRISPR_enzyme': autocomplete.ModelSelect2(url=reverse_lazy('CRISPRoption-autocomplete')),
		'TargetSpecies': autocomplete.ModelSelect2(url=reverse_lazy('SpeciesOption-autocomplete')),
		'TargetFwdPrimer': autocomplete.ModelSelect2(url=reverse_lazy('Primers-autocomplete')),
		'TargetRevPrimer': autocomplete.ModelSelect2(url=reverse_lazy('Primers-autocomplete')),
	}


class Toxins(InventoryItem):
	Toxin = models.TextField(blank=True, null=True)
	Abbreviation = models.TextField(blank=True, null=True)
	Comment = models.TextField(blank=True, null=True)
	Amount = models.FloatField("Amount (μg)", blank=True, null=True)
	Threshold = models.FloatField("Threshold amount (CBB) (mg)", blank=True, null=True)
	Conjugation = models.TextField(blank=True, null=True)
	Source = models.TextField(blank=True, null=True)
	Tag = models.TextField(blank=True, null=True)
	Mw = models.FloatField("Mw (Kda)", blank=True, null=True)
	Vendor = models.ForeignKey(VendorOption, blank=True, null=True, on_delete=models.PROTECT)
	Catalog_no = models.TextField("Catalog no.", blank=True, null=True)
	Link = models.URLField(blank=True, null=True)

	order = [*inventory_order, 'Toxin', 'Abbreviation', 'Comment', 'Amount', 'Threshold', 'Conjugation', 'Source', 'Tag', 'Mw', 'Vendor', 'Catalog_no', 'Link']
	symbol = "TOX"

	widgets = {
		**default_widgets,
		'Vendor': autocomplete.ModelSelect2(url=reverse_lazy('VendorOption-autocomplete')),
	}
	col_display_func_dict = {
		'Link': lambda item: f"<a href='{item.Link}' target='_blank' rel='noopener noreferrer'>{item.Link}</a>" if item.Link else "",
	}
	col_html_string = ['Link']


class AntiGenBodyoption(BaseOption):
	pass


class AntiGenBody(InventoryItem):
	Type = models.ForeignKey(AntiGenBodyoption, on_delete=models.PROTECT, blank=True, null=True)
	CommonName = models.TextField(blank=True, null=True)
	InfoLink = models.URLField(blank=True, null=True)
	BindsTo = models.ManyToManyField("self", blank=True)
	ProductionCellLine = models.ManyToManyField(CellLine, blank=True)

	order = [*inventory_order, 'Type', 'CommonName', 'BindsTo', 'ProductionCellLine', 'InfoLink', 'Batches']
	symbol = "ABAG"

	widgets = {
		**default_widgets,
		'ProductionCellLine': autocomplete.ModelSelect2Multiple(url=reverse_lazy('CellLine-autocomplete')),
		'BindsTo': autocomplete.ModelSelect2Multiple(url=reverse_lazy('AntiGenBody-autocomplete')),
		'Type': autocomplete.ModelSelect2(url=reverse_lazy('AntiGenBodyoption-autocomplete')),
	}

	col_display_func_dict = {
		'BindsTo': lambda item: ", ".join(ab.name for ab in item.BindsTo.all()) if item.BindsTo.all() else "",
		'ProductionCellLine': lambda item: ", ".join(ab.name for ab in item.ProductionCellLine.all()) if item.ProductionCellLine.all() else "",
		'InfoLink': lambda item: f"<a href='{item.InfoLink}' target='_blank' rel='noopener noreferrer'>{item.InfoLink}</a>" if item.InfoLink else "",
		'Batches': lambda item: f"<a href='{reverse('list_AntiGenBodyBatch', kwargs=dict(parent_pk=item.pk))}'>{item.antigenbodybatch_set.filter(archived=False).count()} batches</a>",
	}

	col_html_string = ['InfoLink', 'Batches']
	col_read_only = [*default_readonly, 'Batches']


class AntiGenBodyBatch(AbstractBatch):
	Parent = models.ForeignKey(AntiGenBody, on_delete=models.PROTECT)
	Location = GenericRelation(Vial, related_query_name="AntiGenBodyBatch")

	ProductionCellLine = models.ForeignKey(CellLineBatch, blank=True, null=True, on_delete=models.PROTECT)
	order = [*default_order, 'Location', 'ProductionCellLine', 'Parent']
	symbol = "ABAG_Batch"

	widgets = {
		**default_widgets,
		'ProductionCellLine': autocomplete.ModelSelect2(url=reverse_lazy('CellLineBatch-autocomplete')),
	}

	col_read_only = [*default_readonly, 'Parent', 'Location']
	col_html_string = ['Location']
	col_display_func_dict = {
		'Location': lambda item: ", ".join(
			f"{ab.parent.parent}:{ab.parent}:{pos_to_coord(ab.pos_index, ab.parent.columns)}" for ab in
			item.Location.all()) if item.Location.all() else "",
	}
