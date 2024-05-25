### `apps/frontend/go4success/app/(app)/feedbacklist.tsx`

#### Description générale

Ce fichier permet d'afficher la liste des activités où nous avons des feedbacks disponibles.

#### Importations

Le code importe plusieurs modules et composants nécessaires :

- `React` de `react` pour la gestion de l'état et des effets.
- Divers composants UI de `react-native` pour la mise en page et les interactions utilisateur.
- Un hook personnalisé (`useFeedback`) pour les opérations liées aux feedbacks.
- `ButtonComponent` pour les boutons personnalisés.
- `stylesGlobal` pour les styles globaux de l'application.
- `useTranslation` pour la traduction des textes.
- `useNavigation` et `StackNavigationProp` pour la navigation entre les écrans.
- `useAuth` pour accéder au contexte d'authentification.
- `TableColumn` est utilisé pour définir les colonnes d'un tableau de données.
- `FeedbackTable` est utilisé pour créer le tableau.

#### Types

Le code définit plusieurs interfaces TypeScript :

- `FeedbackListDetailsScreenNavigationProp` & `RootStackParamList` : Permet la navigation.

#### États locaux

- `user` : utilise le hook useAuth pour extraire l'utilisateur actuellement connecté.
- `feedbacks`: utilise le hook useFeedback pour récupérer les feedbacks. Si l'utilisateur est un superutilisateur, tous
  les feedbacks sont récupérés, sinon, seuls les feedbacks de l'utilisateur connecté sont récupérés.
- `t` pour la traduction des textes.
- `useNavigation` pour la navigation entre les écrans.
- `columns` : définit un tableau de colonnes pour le tableau de feedbacks. Chaque colonne a un nom, une fonction de
  sélection pour extraire la valeur de la colonne à partir d'un feedback, une propriété sortable pour indiquer si la
  colonne peut être triée, et une propriété grow pour indiquer combien de place la colonne doit prendre par rapport aux
  autres colonnes.

#### Rendu

Affichage d'un tableau avec des boutons pour ouvrir une autre page associée à l'activité choisie.

#### Gestion des erreurs

Des erreurs sont affichées sur la page si une erreur se produit dans le hook.

#### Styles

Les styles sont définis globalement pour ce composant.