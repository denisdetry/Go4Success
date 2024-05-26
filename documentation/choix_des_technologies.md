
# Choix des technologies

## Introduction

Dans le cadre du projet Go4Success, il nous a été demandé de développer une plateforme d'atelier d'aide à la réussite, disponible pour l'ensemble du campus de l'UCL et accessible sur plusieurs plateformes (Android, iOS, Web).

Le projet, ayant une licence open source et étant destiné à être repris par de futurs développeurs, nécessite des technologies respectant des critères de maintenabilité, disponibilité, sécurité et compatibilité multiplateforme.

## Stack technique

### Django
Django est un framework web open-source, écrit en Python, conçu pour faciliter le développement rapide et le design propre d'applications web. Il est utilisé par un grand nombre d'utilisateurs, ce qui assure une maintenance à long terme et une communauté active.

### Django REST Framework (DRF)
Django REST Framework (DRF) est une bibliothèque open-source qui étend les fonctionnalités de Django pour permettre le développement d'API web de manière plus efficace.

- **Développement d'API RESTful** : DRF facilite la création d'API conformes au style architectural REST (Representational State Transfer). Les API sont orientées ressources, avec des endpoints représentant ces ressources, et utilisent les méthodes HTTP standards (GET, POST, PUT, DELETE, etc.).
- **Sérialisation des données** : DRF fournit des outils puissants pour sérialiser et désérialiser les données, simplifiant ainsi le processus d'échange entre l'application Django et les clients web ou mobiles.
- **Authentification et autorisation** : DRF offre des fonctionnalités robustes pour gérer l'authentification des utilisateurs et les autorisations d'accès aux ressources de l'API. Il prend en charge plusieurs méthodes d'authentification (token, session, OAuth, etc.) et permet de définir des règles d'autorisation granulaires basées sur les rôles des utilisateurs.
- **Vues génériques et mixins** : DRF propose des vues génériques et des mixins qui simplifient la création d'API en fournissant des fonctionnalités communes telles que la pagination, le filtrage, le tri et la validation des données.
- **Documentation automatique** : DRF génère automatiquement une documentation interactive pour les API basées sur les commentaires des développeurs, facilitant ainsi la compréhension de l'API par les autres membres de l'équipe et les utilisateurs finaux.

### React Native
React Native est un framework open-source développé par Facebook qui permet de créer des applications mobiles pour iOS et Android en utilisant JavaScript et React, une bibliothèque JavaScript populaire pour la création d'interfaces utilisateur.

- **Langage de programmation unique** : Avec React Native, vous pouvez utiliser JavaScript pour développer des applications pour iOS et Android, ce qui permet de partager une base de code et de réduire les efforts de développement.
- **Composants réutilisables** : React Native utilise des composants modulaires qui peuvent être réutilisés à travers l'application, facilitant ainsi le développement, la maintenance et l'organisation du code.
- **Performance native** : Contrairement aux frameworks hybrides traditionnels, React Native utilise des composants natifs pour chaque plateforme, offrant ainsi des performances proches des applications natives.
- **Hot Reloading** : React Native propose des fonctionnalités de rechargement à chaud, permettant aux développeurs de voir instantanément les changements de code sans avoir à recompiler l'application.
- **Large communauté et écosystème** : React Native bénéficie d'une large communauté de développeurs, avec de nombreuses ressources, bibliothèques et outils disponibles pour résoudre des problèmes, partager des connaissances et accélérer le développement.

### TanStack
TanStack est un ensemble de bibliothèques JavaScript populaires et bien maintenues, principalement destinées au développement web moderne. Pour ce projet, nous utilisons principalement **React Query**.

- **React Query** : Bibliothèque de gestion de l'état des données dans les applications React. Elle simplifie les requêtes et la synchronisation des données, avec des outils pour gérer les états de chargement, d'erreur, et de succès, ainsi que des fonctionnalités de mise en cache, de mise à jour en arrière-plan et de synchronisation en temps réel.
- La synchronisation en temps réel et la mise en cache des données permettent de rendre l'application disponible sur le web et sur mobile sans contrainte d'utiliser différentes bibliothèques pour formuler des requêtes au backend.

### JWT
JSON Web Token (JWT) est un standard ouvert (RFC 7519) qui définit un moyen compact et sécurisé de transmettre des informations entre deux parties sous forme de jeton JSON. JWT est largement utilisé pour l'authentification et l'autorisation dans les applications web et les API, assurant des échanges sécurisés entre les différentes parties de l'application.

### Docker
Docker est une plateforme open-source qui automatise le déploiement d'applications dans des conteneurs logiciels. Un conteneur est une unité d'exécution légère et portable contenant tout le nécessaire pour exécuter une application, y compris le code, les bibliothèques, les dépendances et les configurations.

- **Déploiement facile** : Docker permet de déployer facilement l'application via des plateformes de déploiement comme CapRover, PortainerIO, assurant ainsi la disponibilité de l'application.

## Conclusion
Ces technologies ont été choisies pour assurer la maintenabilité, la disponibilité et la compatibilité de l'application, en répondant aux exigences du projet Go4Success et en facilitant le travail des futurs développeurs.
