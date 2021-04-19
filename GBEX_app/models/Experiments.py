from django.db import models
from django.urls import reverse_lazy
from django.forms import DateInput

from dal import autocomplete

from GBEX_bigfiles.fields import ResumableFileField
from GBEX_app.helpers import get_upload_path

from .models import GBEXModelBase, BaseOption, default_order, default_widgets
from .Inventory import Strain, CellLine, CellLineBatch, gRNA, CultureMediaBatch

ExperimentWidgets = {
		**default_widgets,
		"RunDate": DateInput(attrs={'data-isdate': "yes"})
	}
ExperimentCDFDict = {'Data_file': lambda item: f"<a href='/downloads/{item.Data_file}'>{str(item.Data_file).split('/')[-1]}</a>", }
ExperimentCHString = ['Data_file', ]
ExperimentOrder = [*default_order, 'Description', 'RunDate', 'Data_file', 'Status']


class ExperimentBase(GBEXModelBase):
	Description = models.TextField(blank=True, null=True)
	RunDate = models.DateField(null=True, blank=True)
	Data_file = ResumableFileField(blank=True, null=True, upload_to=get_upload_path, max_length=500)
	Status = models.TextField(blank=True, null=True)

	menu_label = "Experiments"
	widgets = ExperimentWidgets
	col_display_func_dict = ExperimentCDFDict
	col_html_string = ExperimentCHString
	order = ExperimentOrder

	class Meta:
		abstract = True


class SequencingMachine(BaseOption):
	pass


class SequencingType(BaseOption):
	pass


class SequencingMaterialType(BaseOption):
	pass


class NGSResults(ExperimentBase):
	Machine = models.ForeignKey(SequencingMachine, on_delete=models.PROTECT)
	TypeOfSequencing = models.ForeignKey(SequencingType, on_delete=models.PROTECT)
	TypeOfMaterial = models.ForeignKey(SequencingMaterialType, on_delete=models.PROTECT)

	order = [*ExperimentOrder, 'Machine', 'TypeOfSequencing', 'TypeOfMaterial']
	symbol = "NGS"
	widgets = {
		**ExperimentWidgets,
		'Machine': autocomplete.ModelSelect2(url=reverse_lazy('SequencingMachine-autocomplete')),
		'TypeOfSequencing': autocomplete.ModelSelect2(url=reverse_lazy('SequencingType-autocomplete')),
		'TypeOfMaterial': autocomplete.ModelSelect2(url=reverse_lazy('SequencingMaterialType-autocomplete')),
	}
	col_display_func_dict = {
		**ExperimentCDFDict,
	}


class Fermentation(ExperimentBase):
	Strain = models.ForeignKey(Strain, on_delete=models.PROTECT, null=True, blank=True)
	Media = models.ManyToManyField(CultureMediaBatch, blank=True)

	order = [*ExperimentOrder, 'Strain', 'Media']
	symbol = "FE"
	widgets = {
		**ExperimentWidgets,
		'Strain': autocomplete.ModelSelect2(url=reverse_lazy('Strain-autocomplete')),
		'Media': autocomplete.ModelSelect2Multiple(url=reverse_lazy('CultureMediaBatch-autocomplete')),
	}
	col_display_func_dict = {
		**ExperimentCDFDict,
		'Media': lambda item: ", ".join(ab.name for ab in item.Media.all()) if item.Media.all() else "",
	}


class CellCultivation(ExperimentBase):
	CellLine = models.ForeignKey(CellLineBatch, on_delete=models.PROTECT, null=True, blank=True)
	Media = models.ManyToManyField(CultureMediaBatch, blank=True)

	order = [*ExperimentOrder, 'CellLine', 'Media']
	symbol = "CC"
	widgets = {
		**ExperimentWidgets,
		'CellLine': autocomplete.ModelSelect2(url=reverse_lazy('CellLineBatch-autocomplete')),
		'Media': autocomplete.ModelSelect2Multiple(url=reverse_lazy('CultureMediaBatch-autocomplete')),
	}
	col_display_func_dict = {
		**ExperimentCDFDict,
		'Media': lambda item: ", ".join(ab.name for ab in item.Media.all()) if item.Media.all() else "",
	}


class KOMethodOption(BaseOption):
	pass


class TransfectionMethodOption(BaseOption):
	pass


class KnockoutExperiment(ExperimentBase):
	InputCellLine = models.ForeignKey(CellLine, on_delete=models.PROTECT, related_name='input_cellline')
	KOMethod = models.ForeignKey(KOMethodOption, on_delete=models.PROTECT)
	gRNAs = models.ManyToManyField(gRNA)
	TransfectionMethod = models.ForeignKey(TransfectionMethodOption, on_delete=models.PROTECT)
	OutputCellLines = models.ManyToManyField(CellLine, related_name='output_celllines')

	order = [*ExperimentOrder, 'InputCellLine', 'KOMethod', 'gRNAs', 'TransfectionMethod', 'OutputCellLines']
	symbol = "KOE"
	widgets = {
		**ExperimentWidgets,
		'gRNAs': autocomplete.ModelSelect2Multiple(url=reverse_lazy('gRNA-autocomplete')),
		'InputCellLine': autocomplete.ModelSelect2(url=reverse_lazy('CellLine-autocomplete')),
		'OutputCellLines': autocomplete.ModelSelect2Multiple(url=reverse_lazy('CellLine-autocomplete')),
		'KOMethod': autocomplete.ModelSelect2(url=reverse_lazy('KOMethodOption-autocomplete')),
		'TransfectionMethod': autocomplete.ModelSelect2(url=reverse_lazy('TransfectionMethodOption-autocomplete')),
	}
	col_display_func_dict = {
		**ExperimentCDFDict,
		'gRNAs': lambda item: ", ".join(ab.name for ab in item.gRNAs.all()) if item.gRNAs.all() else "",
		'OutputCellLines': lambda item: ", ".join(ab.name for ab in item.OutputCellLines.all()) if item.OutputCellLines.all() else "",
	}
