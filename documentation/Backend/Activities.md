# Application Django - Activities

Cette application fait la gestion des ateliers : s'inscrire à l'atelier, se déinscrire des ateliers, filter les
ateliers.

#### Vues (Activities)

- **RoomViewSet:** Ce viewset fournit un accès en lecture seule au modèle Room. Il comprend une méthode
  get_rooms_by_site qui prend un site_id en paramètre et renvoie toutes les salles associées à ce site.
- **SiteViewSet:** Ce viewset fournit un accès complet CRUD (Create, Read, Update, Delete) au modèle Site.
- **LanguageViewSet:** Ce viewset fournit un accès complet CRUD au modèle Language.
- **ActivityViewSet:** Ce viewset fournit un accès complet CRUD au modèle Activity. Il surcharge la méthode get_queryset
  pour ne renvoyer que les activités pour lesquelles l'utilisateur actuel ne s'est pas inscrit. La méthode create est
  également surchargée pour gérer une manipulation spécifique des données avant de créer une activité.
- **AttendViewSet:** Ce viewset fournit un accès complet CRUD au modèle Attend. Il surcharge la méthode get_queryset
  pour ne renvoyer que les participations associées à l'utilisateur actuel.
- **filter_queryset:** Il s'agit d'une fonction d'aide utilisée dans ActivityViewSet et AttendViewSet pour filtrer le
  queryset en fonction des paramètres de la requête. Elle supporte le filtrage par name, site, room, date_start,
  date_end, et language.
- **RegisterToActivityView:** Ce viewset fournit un accès complet CRUD au modèle Attend pour les utilisateurs
  authentifiés. Il utilise le RegisterToActivitySerializer pour gérer la sérialisation des données.

#### Serializers (Activities)

Nous allons pas détailler les serializers, car ils sont très simples et sont utilisés pour la validation des données.
Nous allons néanmoins les citer et les décrire brièvement.

- **RoomSerializer:** Ce serializer est utilisé pour valider les données des locaux.
- **CourseSerializer:** Ce serializer est utilisé pour valider les données des cours.
- **LanguageSerializer:** Ce serializer est utilisé pour valider les données des langues.
- **ActivitySerializer:** Ce serializer est utilisé pour valider les données des activités.
- **AttendSerializer:** Ce serializer est utilisé pour valider les données des activités où un utilisateurs authentifié
  est inscrit.
- **SiteSerializer:** Ce serializer est utilisé pour valider les données des villes.
- **RegisterToActivitySerializer:** Ce serializer est utilisé pour valider les données d'inscription à une activité.

#### Urls (Activities)

Les différentes urls de l'application _activities_ sont définies dans le fichier _urls.py_. Elles sont en liens avec les
vues décrites plus haut.

#### Tests (Activities)

Conntient un ensemble de tests pour vérifier les éléments suivants :

- **RoomViewSetTestCase:**
    - _test_get_room_ : Ce test vérifie que l'API renvoie correctement toutes les salles.
    - _test_get_room_not_found_ : Ce test vérifie que l'API renvoie une erreur 404 lorsque l'on tente d'accéder à une
      salle qui n'existe pas.
- **ActivityViewSetTestCase:**
    - _test_get_all_activities_ : Ce test vérifie que l'API renvoie correctement toutes les activités.
- **AttendSerializerTest:**
    - _test_attend_serializer_ : Ce test vérifie que le sérialiseur Attend fonctionne correctement et renvoie les
      données attendues.
    - _test_unattend_activity_ : Ce test vérifie que l'API permet à un utilisateur de se désinscrire d'une activité et
      renvoie le code de statut HTTP 204. Il vérifie également que l'objet Attend est correctement supprimé de la base
      de données.