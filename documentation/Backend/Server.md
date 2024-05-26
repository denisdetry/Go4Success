# Server Django

Celui-ci n'est pas une application django, mais le serveur django en lui-même. Il contient les fichiers de
configuration, les urls, les settings, etc.

#### Settings (Server)

Dans cette section, nous allons parler des parties dans settings.py qui ont été ajoutées ou modifiées pour le bon
fonctionnement du serveur django.

##### _INSTALLED_APPS_

Dans les apps installées, nous avons ajouté les applications django que nous avons créées, ainsi que des applications
pour les JWT tokens, rest_framework, et d'autres. Voici la liste des applications installées :

```python
INSTALLED_APPS = [
    # {...}
    # Application pour le framework rest
    "rest_framework",
    # Application du framework rest pour les JWT tokens
    "rest_framework_simplejwt",
    # Applications pour la gestion du cross-origin resource sharing
    "corsheaders",
    # Nos applications que nous avons crées
    "authentication",
    "activities",
    "database",
    "rolemanagement",
    "feedback",
]
```

##### _MIDDLEWARE_

Comme middleware, nous avons ajouté le middleware pour le cross-origin resource sharing, qui permet à notre application
d'accepter les requêtes venant d'autres domaines.

```python
MIDDLEWARE = [
    # {...}
    "corsheaders.middleware.CorsMiddleware",
]
```

##### _REST_FRAMEWORK_

Voici les paramètres que nous avons ajoutés pour le framework rest :

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

##### _SIMPLE_JWT_

Voici les paramètres que nous avons ajoutés pour le framework rest simple JWT. Ces paramètres peuvent être modifiés
selon vos besoins. Voici les paramètres que nous avons utilisés :

Voici la documentation pour plus d'information sur les
paramètres : https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=30),
    'SLIDING_TOKEN_REFRESH_LIFETIME_LATE_USER': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME_LATE_USER': timedelta(days=30),
}
```

##### _CORS_

Des paramètres ont été ajoutés pour le cross-origin resource sharing. Voici les paramètres que nous avons utilisés :

```python
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS").split(",") if os.getenv(
    "CORS_ALLOWED_ORIGINS") else ["http://localhost:8081", "http://localhost:3000"]
```

##### _CSRF_

En cas de nécessité, le CSRF peut être activé. Voici les paramètres que nous avons utilisés :

```python
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS").split(",") if os.getenv(
    "CSRF_TRUSTED_ORIGINS") else ["http://localhost:8081", "http://localhost:3000"]
```

Si vous souhaitez l'activer, il faut aussi ajouter le middleware suivant :

```python
MIDDLEWARE = [
    # {...}
    "django.middleware.csrf.CsrfViewMiddleware",
]
```

##### _DATABASE_ (Custom User model)

Vu que nous avons créer un modèle de l'utilisateur personnalisé, nous avons dû ajouter le modèle dans les settings de
django. Voici les paramètres que nous avons utilisés :

```python
AUTH_USER_MODEL = "database.User"
```

##### _ALLOWED_HOSTS_

Certains paramètres, comme les hosts autorisés, ont été modifiés. Voici les paramètres que nous avons utilisés :

```python
ALLOWED_HOSTS = list(os.getenv("ALLOWED_HOSTS").split(",")) if os.getenv(
    "ALLOWED_HOSTS") else ["*"]
```

#### Urls (Server)

Dans cette section, nous tenions à vous informer que toutes les urls des applications django sont regroupées dans le
fichier urls.py de l'application _server_. Cela permet de centraliser les urls et de les gérer plus facilement.
**Veuillez à respecter cette manière de faire.**

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("auth/", include("authentification.urls")),
    path("activities/", include("activities.urls")),
    path("rolemanagement/", include("rolemanagment.urls"))
]
```

[//]: # "### Vues Django"

[//]: # "Les vues fonctionnent en utilisant l'APIView de l'API rest. Chaque vue possède une méthode _post_ et/ou _get_ qui sont"

[//]: # "appelées quand la vue est appelée avec une requête HTTP GET ou POST."

[//]: #

[//]: # "- **UserRegisterView** : La vue qui s'occupe d'inscrire les utilisateurs. Elle reçoit les information de l'inscription"

[//]: # "  dans la requête POST."

[//]: #

[//]: # "- **LoginView** : s'occupe de vérifier les credentials de l'utilisateur pour que celui-ci puisse se connecter. La vue"

[//]: # "  fait appel aux méthodes _validate_username_ et _validate_password_ pour faire la validation des credentials."

[//]: #

[//]: # "- **LogoutView** : s'occupe de fermer la session de l'utilisateur."

[//]: #

[//]: # "- **CurrentUserView** : fonctionne avec un GET uniquement. Renvoie les informations de l'utilisateur connecté dans la"

[//]: # "  session actuelle."

[//]: #

[//]: # "- **ActivityViewSet** :"

[//]: #

[//]: # "- **AttendViewSet** : renvoie toutes les _Activity_ auxquelles l'uilisateur est inscrit. Utilisée dans la page d'accueil"

[//]: # "  et le calendrier."

[//]: #

[//]: # "- **RegisterToActivityView** : Permet d'inscrire un utilisateur à une activité."

[//]: #

[//]: # "### _validations.py_"

[//]: #

[//]: # "Ce fichier contient des méthodes qui s'occupe de valider les différents credentials donnés par un utilisateur."