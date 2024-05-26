# Applications Django - PostQuestionnaire

Cette application va s'occuper des questionnaire et des questions.

#### Vues (PostQuestionnaire)

- **QuestionnaireView** : Permet de faire des requêtes GET/POST sur le serializer 'QuestionnaireSerializer'.
- **QuestionView** : Permet de faire des requêtes GET/POST sur le serializer 'QuestionnSerializer'.
- **CourseView** : Permet de faire des requêtes GET/POST sur le serializer 'CourseSerializer'.
- **LanguageView** : Permet de faire des requêtes GET/POST sur le serializer 'LanguageSerializer'.
- **ChoiceAnswerInstanceView** : Permet de faire des requêtes GET/POST sur le serializer '
  ChoiceAnswerInstanceSerializer'.
- **OpenQuestionView** : Permet de faire des requêtes GET/POST sur le serializer 'OpenQuestionSerializer'.
- **ClosedQuestionView** : Permet de faire des requêtes GET/POST sur le serializer 'ClosedQuestionSerializer'.

#### Serializers (PostQuestionnaire)

- **QuestionnaireSerializer** : permet de récupérer les données d'un questionnaire, y compris son identifiant, le cours associé, le titre, la description, le total des points, les dates de début et de fin, et la langue.

- **QuestionSerializer** : permet de récupérer les informations d'une question, y compris les choix de type de question, l'identifiant, le questionnaire associé, le texte de la question, le type de question, et les points attribués.

- **OpenAnswerSerializer** : permet de récupérer les données d'une réponse ouverte, y compris l'identifiant, la question associée, l'étudiant ayant répondu, la réponse de l'étudiant et si la réponse est correcte.

- **ChoiceAnswerSerializer** : permet de récupérer les données d'une réponse à choix, y compris l'identifiant, la question associée et l'étudiant ayant répondu.

- **ChoiceAnswerInstanceSerializer** : permet de récupérer les données d'une instance de réponse à choix, y compris l'identifiant, la réponse à choix associée, le choix sélectionné et si le choix est correct.

- **CourseSerializer** : permet de récupérer les informations d'un cours, y compris l'identifiant, le code et le nom du cours.

- **LanguageSerializer** : permet de récupérer les informations d'une langue, y compris l'identifiant, le nom et le code de la langue.

- **OpenQuestionSerializer** : permet de récupérer les données d'une question ouverte, y compris l'identifiant, la question associée et le texte de la question.

- **ClosedQuestionSerializer** : permet de récupérer les données d'une question fermée, y compris l'identifiant, la question associée, les options de réponse et si l'option est sélectionnée.



#### Tests (PostQuestionnaire)

Contient un ensemble de tests pour vérifier les éléments suivants :

- **QuestionnaireTestCase**

Cette classe fournit des cas de test pour les fonctionnalités liées à la création de questionnaires dans le système.

- **Environnement de test**
     factory (APIRequestFactory) : instance d'APIRequestFactory utilisée pour créer des requêtes.
     userCreation (User) : une instance de superutilisateur créée à des fins de test.
     userCreation2 (User) : une instance d'utilisateur standard créée à des fins de test.

- **Tests**
     - *test_create_questionnaire_invalid* : Teste la création d'un questionnaire avec une authentification utilisateur invalide.
     - *test_create_questionnaire_valid* : Teste la création d'un questionnaire avec une authentification utilisateur valide.
     - *test_create_empty_questionnaire* : Teste la création d'un questionnaire vide avec une authentification utilisateur valide.

#### Urls (PostQuestionnaire)

Les différentes urls de l'application _postquestionnaire_ sont définies dans le fichier _urls.py_. Elles sont en liens
avec les vues décrites plus haut.
