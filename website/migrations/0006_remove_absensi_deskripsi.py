# Generated by Django 5.0.1 on 2024-02-05 05:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0005_alter_detailabsen_absensi_alter_detailabsen_siswa'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='absensi',
            name='deskripsi',
        ),
    ]
