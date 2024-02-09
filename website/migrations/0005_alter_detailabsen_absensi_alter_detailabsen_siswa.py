# Generated by Django 5.0.1 on 2024-02-05 05:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0004_alter_siswa_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='detailabsen',
            name='absensi',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='detail', to='website.absensi'),
        ),
        migrations.AlterField(
            model_name='detailabsen',
            name='siswa',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='siswa', to='website.siswa'),
        ),
    ]
