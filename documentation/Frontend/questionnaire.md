### `apps/frontend/go4success/app/(app)/questionnaire.tsx`

#### Description générale

Ce fichier permet d'afficher le questionnaire.

#### Importations

Le code importe plusieurs modules et composants nécessaires :

- `React`, `useEffect`, `useState` de `react` pour la gestion de l'état et des effets.
- Des hooks personnalisés `useCourses` et `usePostQuestionnaire` pour les opérations liées aux questionnaires. -
  Diverses fonctionnalités de navigation depuis `@react-navigation/native` et `@react-navigation/stack`.
- `Toast` de `react-native-toast-message` pour afficher des notifications.
- Composants UI de `react-native` pour la mise en page et les interactions utilisateur.
- `DateTimePicker` de `react-native-ui-datepicker` pour la sélection des dates.
- `dayjs` pour la manipulation des dates. - Styles et constantes personnalisées de
  l'application (`stylesGlobal`, `Colors`).

#### Types

Le code définit plusieurs types TypeScript pour la validation et l'auto-complétion :

- `RouteParams` : contient les paramètres `courseCode` et `courseName`.
- `RootStackParamList` : type de navigation pour le questionnaire.
- `QuestionnaireRouteProp` : type de la route pour le questionnaire.
- `QuestionnaireComponentProps` : type des props pour `QuestionnaireComponent`.

#### Composant

- `QuestionnaireComponent` : Ce composant gère l'affichage du formulaire de création de questionnaire.

#### États locaux

- `startdate` et `enddate` : gèrent les dates de début et de fin du questionnaire.
- `formData` : gère les données du formulaire.

#### Effet `useEffect`

Mise à jour des dates de début et de fin dans les données du formulaire chaque fois que les dates changent.

#### Méthodes

- `handleChange` : met à jour les données du formulaire en fonction des modifications de l'utilisateur.
- `handleSubmit` : envoie les données du formulaire lorsque l'utilisateur soumet le formulaire et affiche une
  notification de succès.

#### Rendu

Le composant rend un formulaire de création de questionnaire avec : - Des champs de texte pour le titre, la description
et les points totaux. - Des sélecteurs de date pour les dates de début et de fin. - Un sélecteur de langue. - Un bouton
pour soumettre le formulaire.

#### Gestion des erreurs

Si une erreur se produit lors de l'envoi du formulaire, elle est affichée à l'utilisateur.

#### Fonction principale `App`

- Gère l'état `showQuestion` pour afficher soit le composant `QuestionnaireComponent`, soit le composant `Question`.

#### Styles

Le fichier contient des styles personnalisés pour divers éléments du formulaire, définis avec `StyleSheet.create`.

#### Utilisation

Pour utiliser ce composant dans une application React Native, il faut s'assurer que les hooks `useCourses`
et `usePostQuestionnaire`, ainsi que les styles et constantes personnalisés (`stylesGlobal`, `Colors`), soient
correctement définis et importés.

#### Exemple d'utilisation

```jsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import App from "./App"; // le fichier contenant le code ci-dessus

const Stack = createStackNavigator();

export default function Main() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Questionnaire">
                <Stack.Screen name="Questionnaire" component={App} />
                {/* Ajoutez d'autres écrans ici si nécessaire */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
```