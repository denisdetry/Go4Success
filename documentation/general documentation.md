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

### `Racine du projet`

- _.prettierrc_ : contient les règles utilisées par _Prettier_ pour formatter le code.

### `apps/frontend/`

Ce dossier contient tout le code frontend du programme.

Vous trouverez à la racine du dossier deux fichiers docker permettant de lancer le client du programme dans un container
Docker. Pour plus de détails, référez-vous au document 'Docker management.md' dans la documentation."

#### `apps/frontend/go4success/`

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

#### `apps/frontend/go4success/go4success/app/`

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

### `apps/backend/`

Ce dossier contient tout le code backend du programme. La structure des fichiers suit une structure de fichiers du
framework Django.

Le backend possède plusieurs applications django (activities, authentication, database, rolemanagement,..), chacun dans
le dossier backend, et portant un nom représentant la fonctionnaité, ormis le dossier **server**, qui gère l'application
django et ses paramètres (avec le fichiers setting, urls, ...).

- `apps/backend/`

    - `activities`
        - (...) _# application django_
    - `authentication`
        - (...)
    - `database`
        - (...)
    - `feedback`
        - (...)
    - `rolemanagement`
        - (...)
    - `postQuestionnaire`
        - (...)
    - `server`
        - (...) _# serveur django_

Chaque application contient une liste de fichier Vues, Serializers, Urls et Tests. Dans le point suivant (Applications
django), nous explorerons en détail le contenu de chaque application.

# Application React - Front-End

Les différents fichiers de l'application front-end sont documentés dans le dossier `documentation/Frontend/`. Chaque
fichier décrit un fichier du dossier `apps/frontend/go4success/app/(app)` ou `apps/frontend/go4success/app/(auth)`, un
composant, un hook, un contexte ou autre fichier du frontend.

**Notes :** Certains fichiers sont documentés directement dans le code source ou ils sont considérés comme étant du
code `self-documented` et donc, nous avons pas jugé nécessaire de les documenter dans le
dossier `documentation/Frontend/`.

# Applications Django - Back-End

Les différentes applications django sont documentés dans le dossier `documentation/Backend/`. Chaque fichier décrit une
application django, un modèle, une vue, un serializer, un test ou autre fichier du backend.

# Pipeline de développement (Devops)

## Introduction

Cette documentation décrit une pipeline DevOps illustrée par un cycle continu, intégrant les étapes clés du
développement et des opérations. Cette approche vise à améliorer la collaboration entre les équipes de développement (
Dev) et d'opérations (Ops), à augmenter la fréquence des déploiements et à garantir une livraison continue et de haute
qualité des applications logicielles.

## Étapes de la Pipeline

![DevOps Pipeline](./devops.png)

### 1. Plan

- **Outil associé** : Trello
- **Description** : La phase de planification implique la définition des objectifs, la création des tâches et la gestion
  des projets. Trello est utilisé pour organiser les tâches, gérer les flux de travail et suivre l'avancement du projet.

### 2. Code

- **Outil associé** : Git
- **Description** : Les développeurs écrivent le code source du projet. Git est utilisé comme système de contrôle de
  version pour gérer et suivre les modifications du code, facilitant la collaboration et le suivi des contributions.

### 3. Build

- **Outils associés** : Django, React
- **Description** : Le code est compilé et les dépendances sont résolues pour créer une version exécutable de
  l'application en local. Django et React sont utilisés pour construire des applications web, respectivement sur le
  backend et le frontend.

### 4. Test

- **Frameworks associés** : Django, React Native
- **Description** : Les tests automatisés sont exécutés pour s'assurer que le code est fonctionnel avec un certains
  degré de confiance. Django et React Native fournissent des frameworks de test natifs pour exécuter des tests
  unitaires, d'intégration. Ces tests garantissent la qualité et la fiabilité du logiciel.

### 5. Release

- **Description** : Une fois les tests passés, la version est prête à être déployée dans un environnement de production
  ou de pré-production. Cette étape peut inclure des approbations manuelles ou automatiques pour valider le déploiement.

### 6. Deploy

- **Outil associé** : PortainerIO
- **Description** : L'application est déployée sur les serveurs de production. PortainerIO est utilisé pour gérer les
  environnements de conteneurs, assurant une portabilité et une consistance entre les environnements de développement et
  de production.

### 7. Operate

- **Description** : L'application est en production et utilisée par les clients. Les opérations quotidiennes incluent la
  gestion des performances, l'application des correctifs et la gestion des incidents pour assurer une disponibilité
  continue.

### 8. Monitor

- **Outil associé** : SonarQube
- **Description** : La performance de l'application est surveillée pour détecter les problèmes et les erreurs en temps
  réel. SonarQube est utilisé pour analyser la qualité du code, identifier les vulnérabilités et fournir des rapports
  sur les métriques de performance.

## Boucle DevOps

Le cycle DevOps est itératif et continu, chaque phase étant constamment revisitée pour améliorer le processus global.
Les feedbacks de la phase "Monitor" alimentent la phase "Plan", créant une boucle continue de développement,
d'amélioration et de déploiement.

## Outils

- **[Django](https://www.djangoproject.com)** : Un framework web pour le développement backend.
- **[React Native](https://reactnative.dev)** : Un framework pour le développement d'applications mobiles.
- **[Trello](https://trello.com)** : Un outil de gestion de projet et de suivi des tâches.
- **[SonarQube](https://www.sonarqube.org)** : Un outil d'inspection continue de la qualité du code.
- **[Git](https://git-scm.com)** : Un système de contrôle de version distribué.
- **[PortainerIO](https://www.portainer.io)** : Une plateforme de gestion de conteneurs pour automatiser le déploiement
  des applications.

## Conclusion

Cette pipeline DevOps intègre les meilleures pratiques de développement et de gestion des opérations pour offrir une
livraison continue et de haute qualité des applications logicielles. En utilisant les outils et les méthodologies
appropriés, les équipes peuvent collaborer plus efficacement, augmenter la fréquence des déploiements et garantir la
satisfaction des utilisateurs finaux.
