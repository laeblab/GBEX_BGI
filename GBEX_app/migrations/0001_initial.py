# Generated by Django 3.2.9 on 2021-11-15 08:53

import GBEX_app.helpers
import GBEX_bigfiles.fields
import datetime
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AntibioticOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AntiGenBody',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Usage', models.TextField(blank=True, null=True)),
                ('CommonName', models.TextField(blank=True, null=True)),
                ('InfoLink', models.URLField(blank=True, null=True)),
                ('BindsTo', models.ManyToManyField(blank=True, related_name='_GBEX_app_antigenbody_BindsTo_+', to='GBEX_app.AntiGenBody')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AntiGenBodyoption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CellLine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Usage', models.TextField(blank=True, null=True)),
                ('CommonName', models.TextField(blank=True, null=True)),
                ('DeltaGenotype', models.TextField(blank=True, null=True)),
                ('CumulativeGenotype', models.TextField(blank=True, null=True)),
                ('Parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.cellline')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CRISPRoption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CultureMedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Usage', models.TextField(blank=True, null=True)),
                ('ProductName', models.TextField(blank=True, null=True)),
                ('CatalogNo', models.TextField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CultureMediaBatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Location', models.TextField(blank=True, null=True)),
                ('Barcode', models.TextField(blank=True, null=True)),
                ('Parent', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.culturemedia')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='gRNA',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Usage', models.TextField(blank=True, null=True)),
                ('TargetGenome', models.TextField(blank=True, null=True)),
                ('TargetSequence', models.TextField(blank=True, null=True)),
                ('FullOligoSequence', models.TextField(blank=True, null=True)),
                ('PCRProduct', models.TextField(blank=True, null=True)),
                ('Location', models.TextField(blank=True, null=True)),
                ('CRISPR_enzyme', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.crisproption')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='KOMethodOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Plasmid',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Usage', models.TextField(blank=True, null=True)),
                ('CommonName', models.TextField(blank=True, null=True)),
                ('Genotype', models.TextField(blank=True, null=True)),
                ('Genbank_file', GBEX_bigfiles.fields.ResumableFileField(blank=True, max_length=500, null=True, upload_to=GBEX_app.helpers.get_upload_path)),
                ('Antibiotic', models.ManyToManyField(blank=True, to='GBEX_app.AntibioticOption')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SequencingMachine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SequencingMaterialType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SequencingType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SOPTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SpeciesOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Strain',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Usage', models.TextField(blank=True, null=True)),
                ('CommonName', models.TextField(blank=True, null=True)),
                ('Subtype', models.TextField(blank=True, null=True)),
                ('Genotype', models.TextField(blank=True, null=True)),
                ('CatalogNo', models.TextField(blank=True, null=True)),
                ('Genbank_file', GBEX_bigfiles.fields.ResumableFileField(blank=True, max_length=500, null=True, upload_to=GBEX_app.helpers.get_upload_path)),
                ('Antibiotic', models.ManyToManyField(blank=True, to='GBEX_app.AntibioticOption')),
                ('ParentStrain', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.strain')),
                ('Plasmids', models.ManyToManyField(blank=True, to='GBEX_app.Plasmid')),
                ('Species', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.speciesoption')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TransfectionMethodOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='VendorOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('what', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=9, validators=[django.core.validators.MinValueValidator(0)])),
                ('budget', models.PositiveIntegerField()),
                ('order_date', models.DateField(default=datetime.date.today)),
                ('quartzy_import', models.BooleanField(default=False)),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Toxins',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Usage', models.TextField(blank=True, null=True)),
                ('Toxin', models.TextField(blank=True, null=True)),
                ('Abbreviation', models.TextField(blank=True, null=True)),
                ('Comment', models.TextField(blank=True, null=True)),
                ('Amount', models.FloatField(blank=True, null=True, verbose_name='Amount (μg)')),
                ('Threshold', models.FloatField(blank=True, null=True, verbose_name='Threshold amount (CBB) (mg)')),
                ('Conjugation', models.TextField(blank=True, null=True)),
                ('Source', models.TextField(blank=True, null=True)),
                ('Tag', models.TextField(blank=True, null=True)),
                ('Mw', models.FloatField(blank=True, null=True, verbose_name='Mw (Kda)')),
                ('Catalog_no', models.TextField(blank=True, null=True, verbose_name='Catalog no.')),
                ('Link', models.URLField(blank=True, null=True)),
                ('Vendor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.vendoroption')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='StrainBatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Location', models.TextField(blank=True, null=True)),
                ('Barcode', models.TextField(blank=True, null=True)),
                ('TubesLeft', models.PositiveIntegerField(blank=True, null=True)),
                ('Parent', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.strain')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='strain',
            name='Vendor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.vendoroption'),
        ),
        migrations.AddField(
            model_name='strain',
            name='responsible',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='SOP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Summary', models.TextField(blank=True, null=True)),
                ('SOP_file', GBEX_bigfiles.fields.ResumableFileField(blank=True, max_length=500, null=True, upload_to=GBEX_app.helpers.get_upload_path)),
                ('Tags', models.ManyToManyField(blank=True, to='GBEX_app.SOPTag')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('table_settings', models.JSONField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Primers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Usage', models.TextField(blank=True, null=True)),
                ('Sequence', models.TextField(blank=True, null=True)),
                ('Tm', models.PositiveIntegerField(blank=True, null=True, verbose_name='Tm (°C)')),
                ('Conc', models.PositiveIntegerField(blank=True, null=True, verbose_name='Conc (uM)')),
                ('Location', models.TextField(blank=True, null=True)),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PlasmidBatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Barcode', models.TextField(blank=True, null=True)),
                ('Location', models.TextField(blank=True, null=True)),
                ('SequenceVerified', models.BooleanField(default=False)),
                ('Parent', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.plasmid')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='NGSResults',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Description', models.TextField(blank=True, null=True)),
                ('RunDate', models.DateField(blank=True, null=True)),
                ('Data_file', GBEX_bigfiles.fields.ResumableFileField(blank=True, max_length=500, null=True, upload_to=GBEX_app.helpers.get_upload_path)),
                ('Status', models.TextField(blank=True, null=True)),
                ('Machine', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.sequencingmachine')),
                ('TypeOfMaterial', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.sequencingmaterialtype')),
                ('TypeOfSequencing', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.sequencingtype')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='KnockoutExperiment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Description', models.TextField(blank=True, null=True)),
                ('RunDate', models.DateField(blank=True, null=True)),
                ('Data_file', GBEX_bigfiles.fields.ResumableFileField(blank=True, max_length=500, null=True, upload_to=GBEX_app.helpers.get_upload_path)),
                ('Status', models.TextField(blank=True, null=True)),
                ('InputCellLine', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='input_cellline', to='GBEX_app.cellline')),
                ('KOMethod', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.komethodoption')),
                ('OutputCellLines', models.ManyToManyField(related_name='output_celllines', to='GBEX_app.CellLine')),
                ('TransfectionMethod', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.transfectionmethodoption')),
                ('gRNAs', models.ManyToManyField(to='GBEX_app.gRNA')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='grna',
            name='TargetFwdPrimer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='gRNA_fwd_primer', to='GBEX_app.primers'),
        ),
        migrations.AddField(
            model_name='grna',
            name='TargetRevPrimer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='gRNA_rev_primer', to='GBEX_app.primers'),
        ),
        migrations.AddField(
            model_name='grna',
            name='TargetSpecies',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.speciesoption'),
        ),
        migrations.AddField(
            model_name='grna',
            name='responsible',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Fermentation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Description', models.TextField(blank=True, null=True)),
                ('RunDate', models.DateField(blank=True, null=True)),
                ('Data_file', GBEX_bigfiles.fields.ResumableFileField(blank=True, max_length=500, null=True, upload_to=GBEX_app.helpers.get_upload_path)),
                ('Status', models.TextField(blank=True, null=True)),
                ('Media', models.ManyToManyField(blank=True, to='GBEX_app.CultureMediaBatch')),
                ('Strain', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.strain')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='culturemedia',
            name='Vendor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.vendoroption'),
        ),
        migrations.AddField(
            model_name='culturemedia',
            name='responsible',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='CellLineBatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Location', models.TextField(blank=True, null=True)),
                ('Barcode', models.TextField(blank=True, null=True)),
                ('TubesLeft', models.PositiveIntegerField(blank=True, null=True)),
                ('Mycoplasma', models.DateField(blank=True, null=True)),
                ('Parent', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.cellline')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='cellline',
            name='SOP',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.sop'),
        ),
        migrations.AddField(
            model_name='cellline',
            name='Species',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.speciesoption'),
        ),
        migrations.AddField(
            model_name='cellline',
            name='responsible',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='CellCultivation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Description', models.TextField(blank=True, null=True)),
                ('RunDate', models.DateField(blank=True, null=True)),
                ('Data_file', GBEX_bigfiles.fields.ResumableFileField(blank=True, max_length=500, null=True, upload_to=GBEX_app.helpers.get_upload_path)),
                ('Status', models.TextField(blank=True, null=True)),
                ('CellLine', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.celllinebatch')),
                ('Media', models.ManyToManyField(blank=True, to='GBEX_app.CultureMediaBatch')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AntiGenBodyBatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('archived', models.BooleanField(default=False)),
                ('Location', models.TextField(blank=True, null=True)),
                ('Parent', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.antigenbody')),
                ('ProductionCellLine', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.celllinebatch')),
                ('responsible', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='antigenbody',
            name='ProductionCellLine',
            field=models.ManyToManyField(blank=True, to='GBEX_app.CellLine'),
        ),
        migrations.AddField(
            model_name='antigenbody',
            name='Type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='GBEX_app.antigenbodyoption'),
        ),
        migrations.AddField(
            model_name='antigenbody',
            name='responsible',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
    ]