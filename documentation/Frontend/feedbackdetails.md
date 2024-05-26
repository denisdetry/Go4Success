### `apps/frontend/go4success/app/(app)/feedbackdetails.tsx`

#### Description générale

Ce fichier permet d'afficher la liste des feedbacks et ses détails des utilisateurs pour une activité.

#### Importations

Le code importe plusieurs modules et composants nécessaires :

- `React`, `useState` de `react` pour la gestion de l'état et des effets.
- Divers composants UI de `react-native` pour la mise en page et les interactions utilisateur.
- Un hook personnalisé (`useFeedback`) pour les opérations liées aux feedbacks.
- `ButtonComponent` pour les boutons personnalisés.
- `stylesGlobal` pour les styles globaux de l'application.
- `useTranslation` pour la traduction des textes.
- `useNavigation`, `StackNavigationProp`,`RouteProp` et `useRoute` pour la navigation entre les écrans.
- `useAuth` pour accéder au contexte d'authentification.
- `TableColumn` est utilisé pour définir les colonnes d'un tableau de données.
- `FeedbackStudentTable` est utilisé pour créer le tableau.
- `StackScreenProps` pour les propriétés de navigation entre les écrans.
- `Colors` pour les couleurs utilisées dans l'application.
- `FeedbackStudent` pour récupérer le type.

#### Types

Le code définit plusieurs interfaces TypeScript :

- `FeedbackListDetailsScreenProps` & `RootStackParamList` : Permet la navigation.

#### États locaux

- `t` pour la traduction des textes.
- `route` et `navigation` utilisées pour accéder aux propriétés de la route
- `feedbackId` récupère l'ID du feedback à partir des paramètres de la route.
- `activityName` récupère le nom de l'activité à partir des paramètres de la route.
- `feedbackStudent` utilise le hook useFeedbackStudent pour récupérer le feedback et une éventuelle erreur.
- `modalVisible` indique si le modal est visible ou non (Default : False).
- `selectedFeedback` permet de save le feedback choisi.
- `satisfactionLevels` définit un tableau de niveaux de satisfaction avec leurs valeurs et leurs labels traduits.
- `feedbackstudentadditionnalquestions` utilise le hook useFeedbackStudentAdditionalQuestions pour récupérer les
  questions supplémentaires du feedback sélectionné.

#### Méthodes

- `handleOpenModal` : Cette méthode est utilisée pour ouvrir un modal.
- `getLabelFromValue` : Cette méthode est utilisée pour obtenir le label correspondant à une valeur donnée dans le
  tableau satisfactionLevels.

#### Rendu

Affichage d'un tableau avec des boutons pour ouvrir plus de détails sur le feedback.

#### Gestion des erreurs

Des erreurs sont affichées sur la page si une erreur se produit dans le hook.

#### Styles

Les styles sont définis globalement pour ce composant.