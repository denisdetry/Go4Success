# Go4Success - Documentation générale.

Ce document sert à aider des développeurs futur à continuer le projet _Go4Success_ en donnant des directives par rapport
au fonctionnement du projet.

## Technologies utilisées

### Back-end

Pour le côté serveur de l'application, nous utilisons le framework de web dev Django. Nous utilisons l'API Rest de
Django pour faire communiquer le serveur et le client.

### Front-end

Du côté client, puisqu'il faisait partie des éxigences du projet que l'application tourne sur web et sur mobile, nous
avons opté pour l'utilisation du framework JavaScript React Native. Tous nos fichiers de code source du front-end sont
écrits en TypeScript.

### Base de donnée

Pour faire tourner notre base de donnée, nous utilisons le moteur de container Docker. La base de donnée elle-même
tourne sur PostgreSQL.

La documentation plus complète de la base de donnée se trouve dans le dossier `apps/database/` où vous y trouverez un
fichier .lun ouvrable dans le logiciel DB-Main. Ce fichier vous donnera accès au modèle entité relation de la base de
donnée ainsi que le schéma relationel. Si vous rencontrez des problèmes à utiliser DB-Main, des fichiers .PNG sont mis à
votre disposition pour pouvoir visionner les schémas.

## Structure des fichiers

### Racine du projet

- _.prettierrc_ : contient les règles utilisées par _Prettier_ pour formatter le code.

### _apps/frontend/_

Ce dossier contient tout le code frontend du programme.

Vous trouverez à la racine du dossier deux fichiers docker permettant de lancer le client du programme dans un container
Docker.

#### _go4success/_

- **_app/_** contient le code source de l'application
- **_assets/_** contient les images et autres éléments statiques affichés dans l'application.
- **_components/_** contient tous les composants react que nous réutilisons à travers l'application.
- **_constants/_** contient toutes constantes utilisées dans l'application. Notamment les couleurs, les tailles de
  d'écran pour les différentes platformes, etc.
- **_context/_** contient les contextes react que nous utilisons à travers toute l'application. Essentiellement pour
  l'authentification de l'utilisateur, donc c'est **une partie centrale du code frontend.**
- **_hooks/_** contient les différents hooks react utilisés dans l'application.
- **_locales/_** contient les json pour les dictionnaires de traduction i18n pour les langues de l'application.
- **_styles/_** contient les fichiers de style "css". Ici, nous avons essentiellement mis une fiche de style dites
  global, réutilisé un peu partout dans l'application, car les fiches de style un peu plus locale sont directement dans
  les fichiers de code .tsx
- **_types/_** contient les différents types typescript utilisés à travers l'application.
- **_utils/_** contient des fonctions utilitaires (pour faire des requetes au serveur django ou autre) que nous
  détailleront plus en détails dans la doc technique, avec des
  exemples d'utilisation.

#### _go4success/app/_

Ce dossier contient deux parties de l'application :

- **_(auth)_** contient les pages permettant l'inscription et la connexion d'utilisateurs. **L'utilisateur pourra
  accéder
  à ces pages uniquement s'il n'est pas encore connecté à l'application.**
- **_(app)_** contient le reste de l'application, **accessible uniquement si l'utilisateur est connecté**. Il est
  important de noter que chaque fichier dans ce dossier
  correspond à une page s'affichant dans le menu de l'application.
- **Notes :** La gestion d'accès aux pages d'authentification et au reste de l'application, selon le statut de
  l'utilisateur (connecté ou non) est géré par le contexte **Auth.tsx**, situé dans le dossier
  **apps/frontend/go4success/context/**

### _apps/backend/_

Ce dossier contient tout le code backend du programme. La structure des fichiers suit une structure de fichiers du
framework Django.

Le backend possède plusieurs applications django (activities, authentication, database, rolemanagement), chacun dans le
dossier backend, et portant un nom représentant la fonctionnaité, ormis le dossier **server**, qui gère l'application
django et ses paramètres (avec le fichiers setting, urls, ...).

- **apps/backend**
    - **activities**
        - (...) _# application django_
    - **authentication**
        - (...)
    - **database**
        - (...)
    - **rolemanagement**
        - (...)
    - **server**
        - (...) _# serveur django_

## Applications django en détails

Détaillons à present chaque applications django et ses fonctionnalités.

### Activities

Cette application fait la gestion des ateliers : s'inscrire à l'atelier, se déinscrire des ateliers, filter les
ateliers.

#### Vues (Activities)

#### Serializers (Activities)

#### Urls (Activities)

#### Tests (Activities)

### Authentication

Cette application gère l'authentification d'un utilisateur : l'inscription, la connexion, la déconnexion, les
notifications avec Expo Push Notification : https://docs.expo.dev/push-notifications/overview/

#### Vues (Authentication)

Nous avons plusieurs vues essentiels aux fonctionnent de l'authentifications, que nous allors détailler ici. Elles sont
de plusieurs sortes : APIView, ViewSet, etc.

Nous vous mettons les liens de laa documentation des APIView et des ViewSet, pour plus d'information sur ces vues.

- APIView : https://www.django-rest-framework.org/api-guide/views/
- ViewSet : https://www.django-rest-framework.org/api-guide/viewsets/
- ModelViewSet : https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset
- GenericAPIView : https://www.django-rest-framework.org/api-guide/generic-views/
- UpdateAPIView : https://www.django-rest-framework.org/api-guide/generic-views/#updateapiview
- DestroyAPIView : https://www.django-rest-framework.org/api-guide/generic-views/#destroyapiview

Les vues sont les suivantes :

- **_UserRegisterView_** : La vue qui s'occupe d'inscrire les utilisateurs. Elle reçoit les information de l'inscription
  dans la requête POST.

```tsx
// Exemple d'interaction de la vue UserRegisterView en frontend avec react
import { UserRegister } from "@/types/UserRegister";
import { fetchBackend } from "@/utils/fetchBackend";
import { fetchError } from "@/utils/fetchError";

// Ceci est une fonction qui permet d'inscrire un utilisateur,
// mais le plus important est la fonction fetchBackend qui fait une requête au serveur django.
const signUp = async (userData: UserRegister) => {
    try {
        // fetchBackend est une fonction utilitaire qui fait une requête au serveur django.
        // Elle est détaillée dans la section utils du frontend.
        const { data: success } = await fetchBackend({
            type: "POST",
            url: "auth/register/",
            data: {
                username: userData.username,
                email: userData.email,
                // eslint-disable-next-line camelcase
                last_name: userData.lastName,
                // eslint-disable-next-line camelcase
                first_name: userData.firstName,
                noma: userData.noma,
                password: userData.password,
            },
        });

        if (success) {
            // Ces instructions sont essentiels pour la déconnexion.
            // Elles ajoutent les tokens du local storage
            // et mettent à jour le contexte de l'utilisateur.
            await AsyncStorage.setItem("accessToken", success.access);
            await AsyncStorage.setItem("refreshToken", success.refresh);

            await queryClient.invalidateQueries({
                queryKey: ["current_user"],
            });

            // {...} gestion du success de l'inscription avec des Toast ou autre
        }
    } catch (err) {
        const error = err as fetchError;
        // {...} gestion de l'erreur. Exemple :
        if (error.responseError.status === 401) {
            // {...} gestion de l'erreur 401
        }
    }
};
```

- **_TokenObtainPairView_ (LoginView)** : Cette vue vient directement du framework **rest_framework_simple_jwt** et
  s'occupe de
  vérifier les credentials de l'utilisateur pour que celui-ci puisse se connecter. La vue fait des requetes POST, en
  utilisant une username et un password, et renvoie un token d'authentification (access et refresh token) si les
  credentials sont valides.

```tsx
// Exemple d'interaction de la vue TokenObtainPairView en frontend avec react
import { UserLogin } from "@/types/UserLogin";
import { fetchBackend } from "@/utils/fetchBackend";
import { fetchError } from "@/utils/fetchError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "@/context/AuthContext";

const signIn = async (userData: UserLogin) => {
    try {
        const { data: success } = await fetchBackend({
            type: "POST",
            url: "auth/token/",
            data: {
                username: userData.username,
                password: userData.password,
            },
        });

        if (success) {
            // Ces instructions sont essentiels pour la déconnexion.
            // Elles ajoutent les tokens du local storage
            // et mettent à jour le contexte de l'utilisateur.
            await AsyncStorage.setItem("accessToken", success.access);
            await AsyncStorage.setItem("refreshToken", success.refresh);

            await queryClient.invalidateQueries({
                queryKey: ["current_user"],
            });

            // {...} gestion du success de la connexion avec des Toast ou autre
        }
    } catch (err) {
        const error = err as fetchError;
        // {...} gestion de l'erreur. Exemple :
        if (error.responseError.status === 401) {
            // {...} gestion de l'erreur 401
        }
    }
};
```

- **_LogoutView_** : Il n'y pas de vue de déconnexion, car la déconnexion se fait automatiquement en supprimant le
  token (access et refresh) de l'utilisateur. Cela se fait en frontend, en supprimant les tokens du local storage.

```tsx
// Exemple de déconnexion en frontend avec react
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "@/context/AuthContext";
import { fetchError } from "@/utils/fetchError";

const signOut = async () => {
    try {
        // Ces instructions sont essentiels pour la déconnexion.
        // Elles suppriment les tokens du local storage
        // et mettent à jour le contexte de l'utilisateur.
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");

        await queryClient.invalidateQueries({
            queryKey: ["current_user"],
        });

        // {...} gestion du success de la déconnexion avec des Toast ou autre
    } catch (err) {
        const error = err as fetchError;
        // {...} gestion de l'erreur
    }
};
```

- **_CurrentUserView_** : fonctionne avec un GET uniquement. Renvoie les informations de l'utilisateur connecté dans la
  session actuelle.

```tsx
import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

export default function useUser() {
    const { isPending, data: user } = useQuery({
        queryKey: ["current_user"],
        queryFn: async () => {
            try {
                const { data: response } = await fetchBackend({
                    type: "GET",
                    url: "auth/current_user/",
                });
                return response;
            } catch (err) {
                return null;
            }
        },
    });
    return { isPending, user };
}
```

- **_UpdateProfileView_** : Permet à l'utilisateur de mettre à jour son profil. La vue fait une requête PATCH avec les
  nouvelles informations de l'utilisateur. Dans notre application, on utilise le PATCH pour mettre à jour seulement un
  attribut de l'utilisateur (comme le prénom uniquement par exemple). Mais le PUT peut être utilisé pour mettre à jour
  tout l'objet utilisateur.

```tsx
// Exemple de mise à jour du profil en frontend avec react
import { useMutation } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { fetchError } from "@/utils/fetchError";
import { queryClient } from "@/app/_layout";
import { useTranslation } from "react-i18next";

const { t } = useTranslation();

const fetchData = useMutation({
    mutationFn: async () => {
        const data: { [index: string]: any } = {};
        data[dataKey] = newData;
        await fetchBackend({
            type: "PATCH",
            url: "auth/user_profile/" + user.id + "/",
            data: data,
        });
    },
    onSuccess: async () => {
        // {...} gestion du success de la mise à jour du profil avec des Toast ou autre
        await queryClient.invalidateQueries({ queryKey: ["current_user"] });
    },
    onError: async (error: fetchError) => {
        const errorResponse = await error.responseError.json();
        const errorMessages =
            errorResponse[dataKey] || t("translationProfile.defaultErrorMessage");
        // {...} gestion de l'erreur avec des toast ou autre
    },
});
```

- **_DeleteUserView_** : Permet à l'utilisateur de supprimer son compte. La vue fait une requête DELETE pour supprimer
  l'utilisateur.

```tsx
// Exemple de suppression du profil en frontend avec react
import { useMutation } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { queryClient } from "@/app/_layout";
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
const { user } = useAuth();

const handleDeleteUser = useMutation({
    mutationFn: async () => {
        await fetchBackend({
            type: "DELETE",
            url: "auth/delete_user/" + user.id + "/",
        });
    },
    onSettled: () => {
        // {...} gestion de la suppression du profil avec des Toast ou autre
        void queryClient.invalidateQueries({ queryKey: ["current_user"] });
    },

    onError: () => {
        // {...} gestion de l'erreur avec des toast ou autre
    },
});
```

- **_ChangePasswordView_** : Permet à l'utilisateur de changer son mot de passe. La vue fait une requête PUT pour
  changer le mot de passe de l'utilisateur.

```tsx
// Exemple de changement de mot de passe en frontend avec react
import { useMutation } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { fetchError } from "@/utils/fetchError";
import { queryClient } from "@/app/_layout";
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
const { user, signIn } = useAuth();

const fetchData = useMutation({
    mutationFn: async () => {
        await fetchBackend({
            type: "PUT",
            url: "auth/change_password/" + user.id + "/",
            data: {
                // eslint-disable-next-line camelcase
                old_password: oldPassword,
                password: newPassword,
                password2: newPasswordConfirmation,
            },
        });
    },

    onSuccess: () => {
        // {...} gestion du success du changement de mot de passe avec des Toast ou autre
        void queryClient.invalidateQueries({ queryKey: ["current_user"] });
        signIn({ username: user.username, password: newPassword }); // on reconnecte l'utilisateur avec son nouveau mot de passe
    },

    onError: async (error: fetchError) => {
        // {...} gestion de l'erreur avec des toast ou autre
    },
});
```

**Notes :** Si vous apercevez du texte inscrit de cette facon : **t("translationProfile.defaultErrorMessage")**. Cela
signifie que le texte est traduit dans le fichier de traduction i18n. Pour plus d'information sur la traduction,
veuillez consulter la section _locales_ du dossier _go4success_.

#### Serializers (Authentication)

Nous allons pas détailler les serializers, car ils sont très simples et sont utilisés pour la validation des données.
Nous allons néanmoins les citer et les décrire brièvement.

**UserRegistrationSerializer:** Ce serializer est utilisé pour valider les données d'inscription d'un utilisateur.
**UserSerializer:** Ce serializer est utilisé pour valider les données de l'utilisateur.
**UpdateUserSerializer:** Ce serializer est utilisé pour valider les données de mise à jour de l'utilisateur.
**ChangePasswordSerializer:** Ce serializer est utilisé pour valider les données de changement de mot de passe.

#### Validation (Authentication)

Dans le fichier _validations.py_ de l'application _authentication_, nous avons des méthodes qui s'occupent de valider
les
différents credentials donnés par un utilisateur, notamment le nom d'utilisateur, le mot de passe, l'email et le noma (
matricule étudiant).

#### Urls (Authentication)

Les différentes urls de l'application _authentication_ sont définies dans le fichier _urls.py_. Elles sont en liens avec
les vues décrites plus haut.

### Database

Comme son nom l'indique, cette application va gérer les base de données avec l'ORM de django et ses modèles.

#### Models (Database)

#### Vues (Database)

#### Tests (Database)

### Rolemanagement

Cette application va s'occuper de la gestion des roles des utilisateurs. Pour rappel dans l'application, l'utilisateur
peut avoir plusieurs roles : étudiant, professeur, tutor et administrateur. Cette application permet de passer de l'un à
l'autre et allouer certaines permissions à chaque role.

#### Permissions (Rolemanagement)

#### Serializers (Rolemanagement)

#### Tests (Rolemanagement)

#### Urls (Rolemanagement)

#### Vues (Rolemanagement)

### Server

Celui n'est pas une application django, mais le serveur django en lui-même. Il contient les fichiers de configuration,
les urls, les settings, etc.

#### Settings (Server)

#### Urls (Server)

[//]: # "### Vues Django"

[//]: # "Les vues fonctionnent en utilisant l'APIView de l'API rest. Chaque vue possède une méthode _post_ et/ou _get_ qui sont"

[//]: # "appelées quand la vue est appelée avec une requête HTTP GET ou POST."

[//]: #

[//]: # "- **UserRegisterView** : La vue qui s'occupe d'inscrire les utilisateurs. Elle reçoit les information de l'inscription"

[//]: # "  dans la requête POST."

[//]: #

[//]: # "- **LoginView** : s'occupe de vérifier les credentials de l'utilisateur pour que celui-ci puisse se connecter. La vue"

[//]: # "  fait appel aux méthodes _validate_username_ et _validate_password_ pour faire la validation des credentials."

[//]: #

[//]: # "- **LogoutView** : s'occupe de fermer la session de l'utilisateur."

[//]: #

[//]: # "- **CurrentUserView** : fonctionne avec un GET uniquement. Renvoie les informations de l'utilisateur connecté dans la"

[//]: # "  session actuelle."

[//]: #

[//]: # "- **ActivityViewSet** :"

[//]: #

[//]: # "- **AttendViewSet** : renvoie toutes les _Activity_ auxquelles l'uilisateur est inscrit. Utilisée dans la page d'accueil"

[//]: # "  et le calendrier."

[//]: #

[//]: # "- **RegisterToActivityView** : Permet d'inscrire un utilisateur à une activité."

[//]: #

[//]: # "### _validations.py_"

[//]: #

[//]: # "Ce fichier contient des méthodes qui s'occupe de valider les différents credentials donnés par un utilisateur."
