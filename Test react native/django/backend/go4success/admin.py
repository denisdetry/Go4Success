from django.contrib import admin
from .models import *

# Register your models here.
class Go4SuccessAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "message")
    
    
admin.site.register(Go4Success, Go4SuccessAdmin)
