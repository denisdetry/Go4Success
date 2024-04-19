from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response

UserModel = get_user_model()


def custom_validation(data):
    email = data['email'].strip()
    username = data['username'].strip()
    password = data['password'].strip()
    noma = data['noma']
    ##
    if not email or UserModel.objects.filter(email=email).exists():
        return Response('choisir une autre adresse mail, celui-ci existe déjà', status=status.HTTP_400_BAD_REQUEST)
    ##
    if not password or len(password) < 8:
        return Response('choisir un autre mot de passe, minimum 8 caractères', status=status.HTTP_400_BAD_REQUEST)
    ##
    if not username or UserModel.objects.filter(username=username).exists():
        return Response('choisir un autre nom d’utilisateur, celui-ci existe déjà', status=status.HTTP_400_BAD_REQUEST)

    if UserModel.objects.filter(noma=noma).exists():
        return Response('choisir un autre noma, celui-ci est déjà utilisé',
                        status=status.HTTP_400_BAD_REQUEST)
    return data


def validate_email(data):
    email = data['email'].strip()
    if not email:
        raise ValidationError('an email is needed')
    return True


def validate_username(data):
    username = data['username'].strip()
    if not username:
        raise ValidationError('choose another username')
    return True


def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError('a password is needed')
    return True
