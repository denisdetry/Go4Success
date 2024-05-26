# Application Django - Feedback

Cette application aura pour objectif de gérer les feedback pour diverses activités. À la fin d'une activité, les
utilisateurs auront la possibilité de soumettre un feedback personnalisé.

#### Vues (Feedback)

- **FeedbackCreateView:** Cette vue permet de créer un nouvel objet Feedback. Elle utilise le sérialiseur
  FeedbackSerializer pour valider les données entrantes et créer l'objet Feedback.
- **FeedbackListView:** Cette vue renvoie une liste de tous les objets Feedback. Elle utilise le sérialiseur
  FeedbackSerializer. Elle filtre également le queryset en fonction des paramètres de requête id, activity_id et
  user_id.
- **FeedbackAdditionalQuestionsView:** Cette vue renvoie une liste de tous les objets FeedbackAdditionalQuestions. Elle
  utilise le sérialiseur FeedbackAdditionalQuestionsSerializer. Elle filtre également le queryset en fonction du
  paramètre de requête feedback.
- **FeedbackStudentView:** Cette vue permet de créer et de récupérer des objets FeedbackStudent. Elle utilise le
  sérialiseur FeedbackStudentSerializer pour valider les données entrantes et créer l'objet FeedbackStudent. Elle filtre
  également le queryset en fonction du paramètre de requête feedback. Avant de créer un FeedbackStudent, elle valide que
  l'étudiant est dans l'activité, que l'activité est terminée, que le feedback n'existe pas déjà, et que les dates de
  début et de fin du feedback sont valides.
- **FeedbackStudentAdditionalQuestionsView:** Cette vue renvoie une liste de tous les objets
  FeedbackStudentAdditionalQuestions. Elle utilise le sérialiseur FeedbackStudentAdditionalQuestionsSerializer. Elle
  filtre également le queryset en fonction des paramètres de requête feedback et student_id.

#### Serializers (Feedback)

Nous allons pas détailler les serializers, car ils sont très simples et sont utilisés pour la validation des données.
Nous allons néanmoins les citer et les décrire brièvement.

- **ActivitySerializer:** Ce serializer est utilisé pour valider les données des activités.
- **UserSerializer:** Ce serializer est utilisé pour valider les données des users.
- **FeedbackSerializer:** Ce serializer est utilisé pour valider les données des feedbacks.
- **FeedbackAdditionalQuestionsSerializer:** Ce serializer est utilisé pour valider les données des questions
  supplémentaires aux feedbacks.
- **FeedbackStudentSerializer:** Ce serializer est utilisé pour valider les données des réponses aux feedbacks.
- **FeedbackStudentAdditionalQuestionsSerializer:** Ce serializer est utilisé pour valider les données des réponses aux
  questions supplémentaire à un feedback.

#### Tests (Feedback)

Conntient un ensemble de tests pour vérifier les éléments suivants :

- **FeedbackViewSetTestCase:**
    - _test_get_all_feedback_ : Ce test vérifie que tous les feedbacks sont correctement récupérés à partir de l'URL '
      feedbacks-list'. Il compare les données de la réponse avec les données sérialisées de tous les feedbacks.
    - _test_validate_student_in_activity_ok_ : Ce test vérifie que la validation du fait qu'un étudiant participe à une
      activité fonctionne correctement lorsque l'étudiant participe effectivement à l'activité.
    - _test_validate_student_in_activity_ko_ : Ce test vérifie que la validation du fait qu'un étudiant participe à une
      activité fonctionne correctement lorsque l'étudiant ne participe pas à l'activité. Il s'attend à ce qu'une
      exception soit levée avec le message 'student is not in the activity'.
    - _test_validate_activity_is_finished_ok_ : Ce test vérifie que la validation du fait qu'une activité est terminée
      fonctionne correctement lorsque l'activité est effectivement terminée.
    - _test_validate_activity_is_finished_ko_ : Ce test vérifie que la validation du fait qu'une activité est terminée
      fonctionne correctement lorsque l'activité n'est pas encore terminée. Il s'attend à ce qu'une exception soit levée
      avec le message 'The activity has not ended yet'.
    - _test_validate_feedback_not_exists_ok_ : Ce test vérifie que la validation du fait qu'un feedback n'existe pas
      fonctionne correctement lorsque le feedback n'existe effectivement pas.
    - _test_validate_feedback_not_exists_ko_ : Ce test vérifie que la validation du fait qu'un feedback n'existe pas
      fonctionne correctement lorsque le feedback existe déjà. Il s'attend à ce qu'une exception soit levée avec le
      message 'User has already given feedback for this activity'.
    - _test_validate_feedback_date_end_ok_ : Ce test vérifie que la validation de la date de fin du feedback fonctionne
      correctement lorsque la date de fin du feedback est correcte.
    - _test_validate_feedback_date_end_ko_ : Ce test vérifie que la validation de la date de fin du feedback fonctionne
      correctement lorsque la date de fin du feedback est passée. Il s'attend à ce qu'une exception soit levée avec le
      message 'The feedback date has ended. No more feedbacks can be created.'.
    - _test_validate_feedback_date_start_ok_ : Ce test vérifie que la validation de la date de début du feedback
      fonctionne correctement lorsque la date de début du feedback est correcte.
    - _test_validate_feedback_date_start_ok_ : Ce test vérifie que la validation de la date de début du feedback
      fonctionne correctement lorsque la date de début du feedback n'est pas encore arrivée. Il s'attend à ce qu'une
      exception soit levée avec le message 'The feedback date has not started yet. No feedbacks can be created.'.

#### Urls (Feedback)

Les différentes urls de l'application _feedback_ sont définies dans le fichier _urls.py_. Elles sont en liens avec les
vues décrites plus haut.

#### Validations (Feedback)

Dans le fichier _validations.py_ de l'application _feedback_, nous avons des méthodes qui s'occupent de valider les
différents data donnés par un utilisateur lorsqu'il remplit un feedback.