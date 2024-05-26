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

TODO


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
