# Generated by Django 3.0.8 on 2020-07-28 09:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('employees', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True, verbose_name='exact time when the screenshot was taken')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='employee the activity was made by')),
            ],
            options={
                'db_table': 'employees_activity_info',
                'ordering': ['date'],
            },
        ),
        migrations.CreateModel(
            name='ScreenshotActivity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='employee_screenshots', verbose_name='screenshot itself')),
                ('activity_info', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employees.ActivityInfo')),
            ],
            options={
                'db_table': 'employees_screenshots',
            },
        ),
        migrations.DeleteModel(
            name='Screenshot',
        ),
    ]
