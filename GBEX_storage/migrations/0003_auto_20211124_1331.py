# Generated by Django 3.2.9 on 2021-11-24 12:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GBEX_storage', '0002_auto_20211115_1216'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='box',
            options={'ordering': ('id',)},
        ),
        migrations.AlterModelOptions(
            name='location',
            options={'ordering': ('id',)},
        ),
        migrations.AlterModelOptions(
            name='vial',
            options={'ordering': ('id',)},
        ),
        migrations.RenameField(
            model_name='box',
            old_name='location',
            new_name='parent',
        ),
        migrations.RenameField(
            model_name='location',
            old_name='parent_loc',
            new_name='parent',
        ),
        migrations.RenameField(
            model_name='vial',
            old_name='box',
            new_name='parent',
        ),
    ]