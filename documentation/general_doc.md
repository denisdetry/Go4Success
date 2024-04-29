# Go4Success - Documentation générale.

Ce document sert à aider des développeurs futur à continuer le projet _Go4Success_ en donnant des directives par rapport
au fonctionnement du projet.

## Technologies utilisées

### Back-end

Pour le côté serveur de l'application, nous utilisons le framework de web dev Django. Nous utilisons l'API Rest de
Django pour faire communiquer le serveur et le client.

### Front-end

Du côté client, puisqu'il faisait partie des éxigences du projet que l'application tourne sur web et sur mobile, nous
avons opté pour l'utilisation du framework JavaScript React Native. Tous nos fichiers de code source du front-end sont
écrits en TypeScript.

### Base de donnée

Pour faire tourner notre base de donnée, nous utilisons le moteur de container Docker. La base de donnée elle-même
tourne sur PostgreSQL.

La documentation plus complète de la base de donnée se trouve dans le dossier `apps/database/` où vous y trouverez un
fichier .lun ouvrable dans le logiciel DB-Main. Ce fichier vous donnera accès au modèle entité relation de la base de
donnée ainsi que le schéma relationel. Si vous rencontrez des problèmes à utiliser DB-Main, des fichiers .PNG sont mis à
votre disposition pour pouvoir visionner les schémas.

## Structure des fichiers

### Racine du projet

- _.prettierrc_ : contient les règles utilisées par _Prettier_ pour formatter le code.

### _apps/frontend/_

Ce dossier contient tout le code frontend du programme.

Vous trouverez à la racine du dossier deux fichiers docker permettant de lancer le client du programme dans un container
Docker.

#### _go4success/_

- **_app/_** contient le code source de l'application
- **_assets/_** contient les images et autres éléments statiques affichés dans l'application.
- **_components/_** contient tous les composants react que nous réutilisons à travers l'application.
- **_constants/_** contient toutes constantes utilisées dans l'application. Notamment les couleurs, les tailles de
  d'écran pour les différentes platformes, etc.
- **_context/_** contient les contextes react que nous utilisons à travers toute l'application. Essentiellement pour
  l'authentification de l'utilisateur, donc c'est **une partie centrale du code frontend.**
- **_hooks/_** contient les différents hooks react utilisés dans l'application.
- **_locales/_** contient les json pour les dictionnaires de traduction i18n pour les langues de l'application.
- **_styles/_** contient les fichiers de style "css". Ici, nous avons essentiellement mis une fiche de style dites
  global, réutilisé un peu partout dans l'application, car les fiches de style un peu plus locale sont directement dans
  les fichiers de code .tsx
- **_types/_** contient les différents types typescript utilisés à travers l'application.
- **_utils/_** contient des fonctions utilitaires (pour faire des requetes au serveur django ou autre) que nous
  détailleront plus en détails dans la doc technique, avec des
  exemples d'utilisation.

#### _go4success/app/_

Ce dossier contient deux parties de l'application :

- **_(auth)_** contient les pages permettant l'inscription et la connexion d'utilisateurs. **L'utilisateur pourra
  accéder
  à ces pages uniquement s'il n'est pas encore connecté à l'application.**
- **_(app)_** contient le reste de l'application, **accessible uniquement si l'utilisateur est connecté**. Il est
  important de noter que chaque fichier dans ce dossier
  correspond à une page s'affichant dans le menu de l'application.
- **Notes :** La gestion d'accès aux pages d'authentification et au reste de l'application, selon le statut de
  l'utilisateur (connecté ou non) est géré par le contexte **Auth.tsx**, situé dans le dossier
  **apps/frontend/go4success/context/**

### _apps/backend/_

Ce dossier contient tout le code backend du programme. La structure des fichiers suit une structure de fichiers du
framework Django.

Le backend possède plusieurs applications django (activities, authentication, database, rolemanagement), chacun dans le
dossier backend, et portant un nom représentant la fonctionnaité, ormis le dossier **server**, qui gère l'application
django et ses paramètres (avec le fichiers setting, urls, ...).

- **apps/backend**
    - **activities**
        - (...) _# application django_
    - **authentication**
        - (...)
    - **database**
        - (...)
    - **rolemanagement**
        - (...)
    - **server**
        - (...) _# serveur django_

## Applications django en détails

Détaillons à present chaque applications django et ses fonctionnalités.

### Activities

Cette application fait la gestion des ateliers : s'inscrire à l'atelier, se déinscrire des ateliers, filter les
ateliers.

#### Vues (Activities)

#### Serializers (Activities)

#### Urls (Activities)

#### Tests (Activities)

### Authentication

Cette application gère l'authentification d'un utilisateur : l'inscription, la connexion, la déconnexion, les
notifications avec Expo Push Notification : https://docs.expo.dev/push-notifications/overview/

#### Vues (Authentication)

#### Serializers (Authentication)

#### Validation (Authentication)

#### Urls (Authentication)

#### Tests (Authentication)

### Database

Comme son nom l'indique, cette application va gérer les base de données avec l'ORM de django et ses modèles.

#### Models (Database)

#### Vues (Database)

#### Tests (Database)

### Rolemanagement

Cette application va s'occuper de la gestion des roles des utilisateurs. Pour rappel dans l'application, l'utilisateur
peut avoir plusieurs roles : étudiant, professeur, tutor et administrateur. Cette application permet de passer de l'un à
l'autre et allouer certaines permissions à chaque role.

#### Permissions (Rolemanagement)

#### Serializers (Rolemanagement)

#### Tests (Rolemanagement)

#### Urls (Rolemanagement)

#### Vues (Rolemanagement)

### Server

Celui n'est pas une application django, mais le serveur django en lui-même. Il contient les fichiers de configuration,
les urls, les settings, etc.

#### Settings (Server)

#### Urls (Server)

[//]: # (### Vues Django)

[//]: # (Les vues fonctionnent en utilisant l'APIView de l'API rest. Chaque vue possède une méthode _post_ et/ou _get_ qui sont)

[//]: # (appelées quand la vue est appelée avec une requête HTTP GET ou POST.)

[//]: # ()

[//]: # (- **UserRegisterView** : La vue qui s'occupe d'inscrire les utilisateurs. Elle reçoit les information de l'inscription)

[//]: # (  dans la requête POST.)

[//]: # ()

[//]: # (- **LoginView** : s'occupe de vérifier les credentials de l'utilisateur pour que celui-ci puisse se connecter. La vue)

[//]: # (  fait appel aux méthodes _validate_username_ et _validate_password_ pour faire la validation des credentials.)

[//]: # ()

[//]: # (- **LogoutView** : s'occupe de fermer la session de l'utilisateur.)

[//]: # ()

[//]: # (- **CurrentUserView** : fonctionne avec un GET uniquement. Renvoie les informations de l'utilisateur connecté dans la)

[//]: # (  session actuelle.)

[//]: # ()

[//]: # (- **ActivityViewSet** :)

[//]: # ()

[//]: # (- **AttendViewSet** : renvoie toutes les _Activity_ auxquelles l'uilisateur est inscrit. Utilisée dans la page d'accueil)

[//]: # (  et le calendrier.)

[//]: # ()

[//]: # (- **RegisterToActivityView** : Permet d'inscrire un utilisateur à une activité.)

[//]: # ()

[//]: # (### _validations.py_)

[//]: # ()

[//]: # (Ce fichier contient des méthodes qui s'occupe de valider les différents credentials donnés par un utilisateur.)
