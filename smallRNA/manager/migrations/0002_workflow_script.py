# Generated by Django 2.0 on 2018-02-28 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manager', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='workflow',
            name='script',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]