# Go4Success - Documentation générale.

Ce document sert à aider des développeurs futur à continuer le projet _Go4Success_ en donnant des directives par rapport au fonctionnement du projet.

## Technologies utilisées

### Back-end

Pour le côté serveur de l'application, nous utilisons le framework de web dev Django. Nous utilisons l'API Rest de Django pour faire communiquer le serveur et le client.

### Front-end

Du côté client, puisqu'il faisait partie des éxigences du projet que l'application tourne sur web et sur mobile, nous avons opté pour l'utilisation du framework JavaScript React Native. Tous nos fichiers de code source du front-end sont écrits en TypeScript.

### Base de donnée

Pour faire tourner notre base de donnée, nous utilisons le moteur de container Docker. La base de donnée elle-même tourne sur PostgreSQL.

La documentation plus complète de la base de donnée se trouve dans le dossier `apps/database/` où vous y trouverez un fichier .lun ouvrable dans le logiciel DB-Main. Ce fichier vous donnera accès au modèle entité relation de la base de donnée ainsi que le schéma relationel. Si vous rencontrez des problèmes à utiliser DB-Main, des fichiers .PNG sont mis à votre disposition pour pouvoir visionner les schémas.

## Structure des fichiers

### Racine du projet

-   _.prettierrc_ : contient les règles utilisées par _Prettier_ pour formatter le code.

### _apps/frontend/_

Ce dossier contient tout le code frontend du programme.

Vous trouverez à la racine du dossier deux fichiers docker permettant de lancer le client du programme dans un container Docker.

#### _go4success/_

-   _app/_ contient le code source de l'application
-   _assets/_ contient les images et autres éléments statiques affichés dans l'application.
-   _components/_ contient tous les composants react que nous réutilisons à travers l'application.

#### _go4success/app/_

Ce dossier contient deux partie de l'application :

-   _(auth)_ contient les pages permettant l'inscription et la connexion d'utilisateurs.
-   _(app)_ contient le reste de l'application. Il est important de noter que chaque fichier dans ce dossier correspond à une page s'affichant dans le menu de l'application.

### _apps/backend/_

Ce dossier contient tout le code backend du programme. La structure des fichiers suit une structure de fichiers du framework Django.

## Back-end

### Vues Django

Les vues fonctionnent en utilisant l'APIView de l'API rest. Chaque vue possède une méthode _post_ et/ou _get_ qui sont appelées quand la vue est appelée avec une requête HTTP GET ou POST.

-   **UserRegisterView** : La vue qui s'occupe d'inscrire les utilisateurs. Elle reçoit les information de l'inscription dans la requête POST.

-   **LoginView** : s'occupe de vérifier les credentials de l'utilisateur pour que celui-ci puisse se connecter. La vue fait appel aux méthodes _validate_username_ et _validate_password_ pour faire la validation des credentials.

-   **LogoutView** : s'occupe de fermer la session de l'utilisateur.

-   **CurrentUserView** : fonctionne avec un GET uniquement. Renvoie les informations de l'utilisateur connecté dans la session actuelle.

-   **ActivityViewSet** :

-   **AttendViewSet** : renvoie toutes les _Activity_ auxquelles l'uilisateur est inscrit. Utilisée dans la page d'accueil et le calendrier.

-   **RegisterToActivityView** : Permet d'inscrire un utilisateur à une activité.

### _validations.py_

Ce fichier contient des méthodes qui s'occupe de valider les différents credentials donnés par un utilisateur.
