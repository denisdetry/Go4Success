### `apps/frontend/go4success/app/(app)/question.tsx`

#### Description générale

Ce fichier définit plusieurs composants pour gérer la création et l'affichage de questions dans un questionnaire,
notamment des questions ouvertes et des questions fermées. Il utilise diverses bibliothèques et hooks pour faciliter les
opérations CRUD sur les questions.

#### Importations

Le code importe plusieurs modules et composants nécessaires :

- `React`, `useState`, `useEffect` de `react` pour la gestion de l'état et des effets.
- Divers composants UI de `react-native` pour la mise en page et les interactions utilisateur.
- `Toast` de `react-native-toast-message` pour afficher des notifications.
- Plusieurs hooks
  personnalisés (`useLastQuestionnaire`, `usePostOpenQuestion`, `usePostQuestion`, `useGetQuestions`, `usePostClosedQuestion`)
  pour les opérations liées aux questionnaires.
- `useMutation`, `useQueryClient` de `@tanstack/react-query` pour la gestion des requêtes et mutations.
- `ButtonComponent` pour les boutons personnalisés.
- `stylesGlobal` pour les styles globaux de l'application.

#### Types

Le code définit plusieurs interfaces TypeScript pour la validation et l'auto-complétion :

- `ClosedQuestion` : définit la structure d'une question fermée.
- `OpenQuestion` : définit la structure d'une question ouverte.
- `refetchedQuestions` : définit la structure des questions récupérées.
- `closedQuestionToSend` : définit la structure des questions fermées à envoyer.

#### Composant `QuestionBox`

Ce composant gère l'affichage et la manipulation des questions d'un questionnaire.

##### États locaux

- `modalVisible` : contrôle la visibilité de la modal.
- `openQuestions` : stocke les questions ouvertes.
- `closedQuestions` : stocke les questions fermées.
- `closedQuestionsProcessed` : indique si les questions fermées ont été traitées.
- `refetchQuestionsData` : stocke les données des questions récupérées.

##### Effet `useEffect`

Met à jour les données des questions récupérées lorsque les questions fermées sont traitées.

##### Méthodes

- `handleOpenQuestion` : ajoute une question ouverte.
- `handleAddClosedQuestion` : ajoute une question fermée.
- `handleSaveOpenQuestions` : sauvegarde les questions ouvertes et fermées, et affiche une notification.

##### Rendu

Le composant rend un formulaire pour créer des questions ouvertes et fermées, avec des options pour ajouter des
questions et les sauvegarder.

#### Composant `OpenQuestionBox`

Ce composant gère l'affichage et la manipulation d'une question ouverte.

##### États locaux

- `question` : texte de la question ouverte.
- `points` : points attribués à la question.

##### Méthodes

- `handleSaveQuestion` : sauvegarde la question ouverte et affiche une notification.

##### Rendu

Le composant rend un formulaire pour entrer le texte et les points de la question ouverte, avec un bouton pour
sauvegarder la question.

#### Composant `ClosedQuestionBox`

Ce composant gère l'affichage et la manipulation d'une question fermée.

##### États locaux

- `question` : texte de la question fermée.
- `options` : options de la question fermée.
- `points` : points attribués à la question.

##### Méthodes

- `handleCheck` : coche ou décoche une option.
- `handleAddOption` : ajoute une nouvelle option.
- `handleOptionChange` : modifie le texte d'une option.
- `handleSaveQuestion` : sauvegarde la question fermée et affiche une notification.

##### Rendu

Le composant rend un formulaire pour entrer le texte et les points de la question fermée, gérer les options, et un
bouton pour sauvegarder la question.

#### Composant `Question`

Ce composant gère l'affichage du composant `QuestionBox` et des questions fermées.

##### États locaux

- `closedQuestionVisible` : contrôle la visibilité des questions fermées.
- `questionCount` : compte le nombre de questions.
- `questionnaire` : récupère le dernier questionnaire.

##### Méthodes

- `handleAddQuestion` : ajoute une nouvelle question fermée.

##### Rendu

Le composant rend un formulaire pour ajouter et afficher les questions du questionnaire.

#### Styles

Le fichier contient des styles personnalisés pour divers éléments du formulaire, définis avec `StyleSheet.create`.

#### Utilisation

Pour utiliser ce composant dans une application React Native, il faut s'assurer que les hooks et composants nécessaires
soient correctement définis et importés.