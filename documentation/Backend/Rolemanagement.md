# Application Django - Rolemanagement

Cette application va s'occuper de la gestion des roles des utilisateurs. Pour rappel dans l'application, l'utilisateur
peut avoir plusieurs roles : étudiant, professeur, tutor et administrateur. Cette application permet de passer de l'un à
l'autre et allouer certaines permissions à chaque role.

#### Vues (Rolemanagement)

- **UserView** : permet de faire des requêtes GET/PATCH/POST sur le serializer 'UserSerializer'
- **EditRoleView** : permet de faire des requêtes GET/PATCH/POST sur le serializer 'EditRoleSerializer'

#### Serializers (Rolemanagement)

- **UserSerializer** : qui permet de récupérer les données de l'utilisateur et son rôle
- **TeacherSerializer** : Permet de récupérer le rôle de l'utilisateur, s'il est professeur ou tuteur.
- **EditRoleSerializer** : permet d'editer le rôle d'un utiliateur.

#### Tests (Rolemanagement)

Conntient un ensemble de tests pour vérifier les éléments suivants :

- \*\*
  TODO

#### Urls (Rolemanagement)

Les différentes urls de l'application _rolemanagement_ sont définies dans le fichier _urls.py_. Elles sont en liens avec
les vues décrites plus haut.

#### Permissions (Rolemanagement)

Afin d'éviter que les utilisateurs non superuser change le rôles des utilisateurs, la class **IsSuperUser** permet de
vérifier que l'utilisateur courant est un superuser.