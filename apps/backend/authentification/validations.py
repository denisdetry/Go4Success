import re

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response

UserModel = get_user_model()


def custom_validation(data):
    email = data['email'].strip()
    username = data['username'].strip()
    password = data['password'].strip()

    check_email = validate_email(email)
    if check_email:
        return check_email

    check_username = validate_username(username)
    if check_username:
        return check_username

    check_password = validate_password(password)
    if check_password:
        return check_password

    if 'noma' in data:
        noma = data['noma'].strip()
        check_noma = validate_noma(noma)
        if check_noma:
            return check_noma
    return data


def validate_email(email):
    if not email or UserModel.objects.filter(email=email).exists():
        return Response('choisir une autre adresse mail, celui-ci existe déjà', status=status.HTTP_400_BAD_REQUEST)


def validate_username(username):
    if not username or UserModel.objects.filter(username=username).exists():
        return Response("choisir un autre nom d'utilisateur, celui-ci existe déjà", status=status.HTTP_400_BAD_REQUEST)


def validate_password(password):
    # Password length
    if not password or len(password) < 8:
        return Response('Le mot de passe doit contenir au moins 8 caractères', status=status.HTTP_400_BAD_REQUEST)

    if not re.search(r'[0-9]', password):
        return Response('Le mot de passe doit contenir au moins un chiffre', status=status.HTTP_400_BAD_REQUEST)

    # Vérification des caractères spéciaux, des majuscules et des minuscules
    if not re.search(r'[!@#\$%\^&\*\(\),\.\?":{}\|<>\-_+]', password):
        return Response('Le mot de passe doit contenir au moins un caractère spécial',
                        status=status.HTTP_400_BAD_REQUEST)

    # Vérification des majuscules
    if not re.search(r'[A-Z]', password):
        return Response('Le mot de passe doit contenir au moins une majuscule', status=status.HTTP_400_BAD_REQUEST)

    # Vérification des minuscules
    if not re.search(r'[a-z]', password):
        return Response('Le mot de passe doit contenir au moins une minuscule', status=status.HTTP_400_BAD_REQUEST)


def validate_noma(noma):
    if UserModel.objects.filter(noma=noma).exists() and noma != "":
        return Response('choisir un autre noma, celui-ci est déjà utilisé',
                        status=status.HTTP_400_BAD_REQUEST)
    if not noma.isdigit() or len(noma) != 8:
        return Response('Le noma doit contenir 8 chiffres', status=status.HTTP_400_BAD_REQUEST)
