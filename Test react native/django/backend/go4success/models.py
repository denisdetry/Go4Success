from django.db import models

# Create your models here.
class Go4Success(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    phone = models.CharField(max_length=100)
    message = models.TextField()

    def __str__(self):
        return self.name