# Application Django - Authentication

Cette application gère l'authentification d'un utilisateur : l'inscription, la connexion, la déconnexion, les
notifications avec Expo Push Notification : https://docs.expo.dev/push-notifications/overview/

#### Vues (Authentication)

Nous avons plusieurs vues essentiels aux fonctionnent de l'authentifications, que nous allors détailler ici. Elles sont
de plusieurs sortes : APIView, ViewSet, etc.

Nous vous mettons les liens de la documentation des APIView et des ViewSet, pour plus d'information sur ces vues.

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
            // Elles ajoutent les tokens dans le local storage
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
            // Elles ajoutent les tokens dans le local storage
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
                await AsyncStorage.removeItem("accessToken");
                await AsyncStorage.removeItem("refreshToken");
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
dataKey = "first_name";
newData = "John";

const fetchData = useMutation({
    mutationFn: async () => {
        const data: { [index: string]: any } = {};
        data[dataKey] = newData; // dataKey représente l'attribut à mettre à jour
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
            errorResponse[dataKey] ||
            t("translationProfile.defaultErrorMessage");
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
    onSuccess: () => {
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
const { user } = useAuth();

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

- **UserRegistrationSerializer:** Ce serializer est utilisé pour valider les données d'inscription d'un utilisateur.
- **UserSerializer:** Ce serializer est utilisé pour valider les données de l'utilisateur.
- **UpdateUserSerializer:** Ce serializer est utilisé pour valider les données de mise à jour de l'utilisateur.
- **ChangePasswordSerializer:** Ce serializer est utilisé pour valider les données de changement de mot de passe.

#### Validation (Authentication)

Dans le fichier _validations.py_ de l'application _authentication_, nous avons des méthodes qui s'occupent de valider
les différents credentials donnés par un utilisateur, notamment le nom d'utilisateur, le mot de passe, l'email et le
noma (matricule étudiant).

#### Urls (Authentication)

Les différentes urls de l'application _authentication_ sont définies dans le fichier _urls.py_. Elles sont en liens avec
les vues décrites plus haut.

#### Tests (Authentication)

Pour les tests concernant l'authentification, veuillez consulter le fichier `tests_authentication.md` du dossier
courant.