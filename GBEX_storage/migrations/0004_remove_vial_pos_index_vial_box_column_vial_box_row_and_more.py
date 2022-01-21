# Generated by Django 4.0.1 on 2022-01-11 08:42

import GBEX_app.models.Inventory
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('GBEX_storage', '0003_auto_20211124_1331'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vial',
            name='pos_index',
        ),
        migrations.AddField(
            model_name='vial',
            name='box_column',
            field=models.PositiveIntegerField(default=2),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='vial',
            name='box_row',
            field=models.PositiveIntegerField(default=2),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='box',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='GBEX_storage.location'),
        ),
        migrations.AlterField(
            model_name='location',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='GBEX_storage.location'),
        ),
        migrations.AlterField(
            model_name='vial',
            name='content_type',
            field=models.ForeignKey(limit_choices_to=models.Q(('model', GBEX_app.models.Inventory.AntiGenBodyBatch), ('model', GBEX_app.models.Inventory.CellLineBatch), ('model', GBEX_app.models.Inventory.CultureMediaBatch), ('model', GBEX_app.models.Inventory.PlasmidBatch), ('model', GBEX_app.models.Inventory.StrainBatch), ('model', GBEX_app.models.Inventory.gRNA), ('model', GBEX_app.models.Inventory.Primers), ('model', GBEX_app.models.Inventory.Toxins), _connector='OR'), null=True, on_delete=django.db.models.deletion.PROTECT, to='contenttypes.contenttype'),
        ),
        migrations.AlterField(
            model_name='vial',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='GBEX_storage.box'),
        ),
        migrations.AddConstraint(
            model_name='vial',
            constraint=models.UniqueConstraint(fields=('parent', 'box_row', 'box_column'), name='unique_vial_box'),
        ),
    ]