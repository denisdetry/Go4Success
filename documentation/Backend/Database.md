# Application Django - Database

Comme son nom l'indique, cette application va gérer les base de données avec l'ORM de django et ses modèles.

#### Models (Database)

Voici les différents modèles :

- **User :** Ce modèle représente l'utilisateur de l'application. Nous avons pour créer un modèle d'user par dessus
  celui
  fourni par django, afin d'y ajouter notamment le noma (matricule étudiant) Il contient les attributs suivants :

    - **id** : l'identifiant de l'utilisateur pour la base de données.
    - **username** : Le nom d'utilisateur de l'utilisateur.
    - **email** : L'email de l'utilisateur.
    - **first_name** : Le prénom de l'utilisateur.
    - **last_name** : Le nom de famille de l'utilisateur.
    - **noma** : Le matricule de l'utilisateur.
    - **is_active** : Un booléen qui indique si l'utilisateur est actif.
    - **is_staff** : Un booléen qui indique si l'utilisateur est un membre du staff.
    - **is_superuser** : Un booléen qui indique si l'utilisateur est un super utilisateur.
    - **date_join** : La date à laquelle l'utilisateur s'est inscrit.
    - **last_login** : La date à laquelle l'utilisateur s'est connecté pour la dernière fois.

- **Course :** Ce modèle représente un cours. Il contient les attributs suivants :

    - **id** : l'identifiant du cours pour la base de données.
    - **code** : La code du cours.
    - **name** : Le nom du cours.
    - **user** : Le professeur du cours.

- **Site :** Ce modèle représente un site. Un site est le nom du campus. Il contient les attributs suivants :

    - **id** : l'identifiant du site pour la base de données.
    - **name** : Le nom du site.

- **Room :** Ce modèle représente une classe/auditoire/amphithéatre. Il contient les attributs suivants :

    - **id** : l'identifiant de la classe pour la base de données.
    - **name** : Le nom de la classe.
    - **site** : Le site où est situé la classe.

- **Language :** Ce modèle représente une langue. Il contient les attributs suivants :

    - **id** : l'identifiant de la langue pour la base de données.
    - **name** : Le nom de la langue (Exemple: Français)s.
    - **code** : Le code de la langue (Exemple: FR).

- **Activity :** Ce modèle représente une activité. Il contient les attributs suivants :

    - **id** : l'identifiant de l'activité pour la base de données.
    - **name** : Le nom de l'activité.
    - **description** : La description de l'activité.
    - **start_date** : La date de début de l'activité.
    - **end_date** : La date de fin de l'activité.
    - **course** : Le cours de l'activité.
    - **room** : La classe de l'activité.
    - **language** : La langue de l'activité.

- **Attend :** Ce modèle représente la relation entre un utilisateur et une activité. Il permet de savoir quel
  utilisateur est inscrit à quelle activité. Il contient les attributs :
  suivants :

    - **activity** : L'activité.
    - **student** : L'étudiant.

  **Notes :** Ici, l'identifiant pour la base de données est le tuple (activity, student) qui doit être unique.

- **Teacher :** Ce modèle représente un professeur. Il contient les attributs suivants :

    - **user** : L'utilisateur.
    - **is_tutor** : Un booléan qui permet de savoir si l'utilisateur est un tuteur.
    - **is_professor**: Un booléan qui permet de savoir si l'utilisateur est un professeur.
      **Notes:** Une contrainte est mise en place pour que l'utilisateur soit soit un tuteur, soit un professeur. Voir
      plus en détail dans la méthode _clean()_ du modèle.

- **Give :** Ce modèle est une relation entre activité et professeur. Il permet de savoir quel professeur donne quel
  cours. Il contient les attributs suivants :

    - **activity** : L'activité.
    - **teacher** : Le professeur.

- **Annoucement :** Ce modèle représente une annonce. Les annonces sont donnés par les professeur envers tous les
  étudiants. Il contient les attributs suivants :

    - **id** : l'identifiant de l'annonce pour la base de données.
    - **title** : Le titre de l'annonce.
    - **description** : La description de l'annonce.
    - **publication_date** : La date de publication de l'annonce.
    - **teacher** : Le professeur qui a posté l'annonce.

- **Registered :** Ce modèle représente une relation entre un étudiant et un cours. Elle permet de savoir quel étudiant
  est inscrit à quel cours. Il contient les attributs suivants :

    - **student** : L'étudiant.
    - **course** : Le cours.

- **Message :** Ce modèle représente un message. Un message est émis entre deux étudiants. Il contient les attributs
  suivants :

    - **id** : l'identifiant du message pour la base de données.
    - **content** : Le contenu du message.
    - **date** : La date du message.
    - **to_user** : L'envoyeur du message.
    - **from_user** : Le receveur du message.

- **See :** Ce modèle représente une relation entre une annonce et un utilisateur. Il permet de savoir quel utilisateur
  a
  vu quel announce. Il contient les attributs suivants :

    - **annoucement** : L'annonce émis par un professeur (modèle Teacher).
    - **user** : L'utilisateur.

- **Feedback :** Ce modèle represente un feedback pour une activité. Il contient
  les attributs suivants :

    - **id** : L'identifiant du feedback pour la base de données.
    - **user** : L'étudiant qui a donné le feedback.
    - **activity** : L'activité pour laquelle le feedback est donné.
    - **positive_point** : Si le feedback doit contenir des points positifs de l'activité.
    - **negative_point** : Si le feedback doit contenir des points négatifs de l'activité.
    - **suggestion** : Si le feedback doit contenir des suggestions pour améliorer l'activité.
    - **additional_comment** : Si le feedback doit contenir des commentaires additionnels.
    - **date_start** : La date de début du feedback.
    - **date_end** : La date de fin du feedback.

- **Feedback_Additional_Question :** Ce modèle permet d'ajouter des questions supplémentaires au feedback. Il contient
  les attributs suivants :

    - **id**: L'identifiant de la question supplémentaire.
    - **feedback** : Le feedback qui contient la question supplémentaire.
    - **question** : La question supplémentaire.

- **Feedback_Student :** Ce modèle represente la réponse pour un feedback écrit par un étudiant. Il contient les
  attributs suivants :

    - **id** : L'identifiant du feedback pour la base de données.
    - **student** : L'étudiant qui a donné le feedback.
    - **feedback** : Le feedback à remplir.
    - **evaluation** : Niveau statisification de l'acitivté (0-5).
    - **positive_point** :Les points positifs de l'activité.
    - **negative_point** :Les points négatifs de l'activité.
    - **suggestion** : Les suggestions pour améliorer l'activité.
    - **additional_comment** : Les commentaires additionnels.
    - **date_submitted** : La date à laquelle le feedback a été soumis.

- **Feedback_Student_Additional_Question :** Ce modèle permet de répondre aux questions supplémentaires d'un feedback.
  Il contient les attributs suivants :

    - **id**: L'identifiant de la question supplémentaire.
    - **student** : L'étudiant qui répond à la question.
    - **feedback** : Le feedback qui contient la question supplémentaire.
    - **question** : La question supplémentaire.
    - **answer** : La réponse de l'étudiant à la question.

- **Questionnaire :** Ce modèle représentaire un questionnaire qu'un profeseur peut créer pour tel cours. Il contient
  les attributs suivants :

    - **id** : l'identifiant du questionnaire pour la base de données.
    - **course** : Le cours pour lequel le questionnaire est créé.
    - **title** : Le titre du questionnaire.
    - **description** : La description du questionnaire.
    - **points_total** : Le nombre de points total du questionnaire.
    - **date_start** : La date à laquelle le questionnaire a été créé.
    - **date_end** : La date limite à laquelle le questionnaire prendra fin.
    - **language** : La langue du questionnaire.

- **Question :** Ce modèle représente une question d'un questionnaire. Il contient les attributs suivants :

    - **id** : l'identifiant de la question pour la base de données.
    - **questionnaire** : Le questionnaire auquel la question appartient.
    - **question** : La question (ouvert, choix multiple, etc...).
    - **points** : Le nombre de points de la question.

- **OpenAnswer** : Ce modèle représente une réponse ouverte à une question. Il contient les attributs suivants :

    - **id** : l'identifiant de la réponse pour la base de données.
    - **question** : La question à laquelle la réponse est donnée.
    - **student** : L'étudiant qui a donné la réponse.
    - **answer** : La réponse donnée par l'étudiant.
    - **is_correct** : Un booléen qui indique si la réponse est correcte.

- **ChoiceAnswer :** Ce modèle représente une réponse à choix multiple à une question. Il contient les attributs
  suivants
  :

    - **id** : l'identifiant de la réponse pour la base de données.
    - **question** : La question à laquelle la réponse est donnée.
    - **student** : L'étudiant qui a donné la réponse.

- **ChoiceAnswerInstance :** Ce modèle représente une instance de réponse à choix multiple. Il contient les attributs
  suivants :

    - **id** : l'identifiant de l'instance de réponse pour la base de données.
    - **choice_answer** : La réponse à choix multiple.
    - **choice** : Le choix de l'étudiant.
    - **is_correct** : Un booléen qui indique si le choix est correct.

- **ExpoToken :** Ce modèle sert à stocker les tokens expo pour les notifications. Il contient les attributs suivants :

    - **id** : l'identifiant du token pour la base de données.
    - **user** : L'utilisateur qui a le token.
    - **token** : Le token expo de l'utilisateur.
    - **is_active** : Un booléen qui indique si le token est actif.
    - **Notes :** Un utilisateur peut avoir
      le même token car elle est unique pour l'appareil mais l'attribut is_active définit si l'appareil en question
      recevra
      une notification si et seulement si l'attribut est **True**.

**Notes :** Pour plus d'informations sur les modèles, veuillez consulter les fichiers _models.py_ de l'application
django _database_. De plus, un schéma de la base donnée, sous sa forme entité relation et relationnel, est disponible
dans le dossier _database_. Ils portent les noms de _**g4s_ER.png**_ et _**g4s_rel_model.png**_. Un fichier .lun est
aussi
disponible, qui peut être ouvert avec le logiciel **DB-Main**, afin de modifier les schémas.