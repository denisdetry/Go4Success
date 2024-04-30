from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    """
    Permission personnalisée pour permettre uniquement aux super utilisateurs d'accéder à une vue.
    """

    def has_permission(self, request, view):
        # Retourne True si l'utilisateur est authentifié et est un super utilisateur
        return bool(request.user and request.user.is_superuser)
