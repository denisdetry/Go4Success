# Documentation des Tests d'Authentification

Les tests d'authentification sont situés dans le répertoire `apps/backend/authentification/tests`. Ils sont conçus pour
s'assurer que le système d'authentification fonctionne comme prévu. Les tests couvrent divers aspects du processus
d'authentification, y compris l'enregistrement des utilisateurs, la connexion, le changement de mot de passe et les
mises à jour du profil utilisateur.

## Fichiers de Test

Les tests d'authentification sont divisés en plusieurs fichiers, chacun testant une vue ou une fonctionnalité
spécifique :

- `tests_urls.py` : Ce fichier contient des tests pour le routage des URL. Il s'assure que chaque URL résout
  correctement sa vue associée.

- `views/tests_change_password_view.py` : Ce fichier contient des tests pour la vue `ChangePasswordView`. Il vérifie que
  la fonctionnalité de changement de mot de passe fonctionne correctement, y compris divers cas limites tels que la
  fourniture d'un ancien mot de passe incorrect ou de nouveaux mots de passe non concordants.

- `views/tests_current_user_view.py` : Ce fichier contient des tests pour la vue `CurrentUserView`. Il vérifie que la
  vue renvoie correctement les détails de l'utilisateur actuellement authentifié.

- `views/tests_delete_user_view.py` : Ce fichier contient des tests pour la vue `DeleteUserView`. Il vérifie qu'un
  utilisateur peut être correctement supprimé, et gère les cas où la suppression ne devrait pas être autorisée, comme
  lorsque le mot de passe fourni est incorrect.

- `views/tests_jwt_view.py` : Ce fichier contient des tests pour les vues d'authentification JWT (`TokenObtainPairView`
  et `TokenRefreshView`). Il vérifie que les jetons JWT sont correctement émis et actualisés.

- `views/tests_register_user_view.py` : Ce fichier contient des tests pour la vue `UserRegisterView`. Il vérifie que
  l'enregistrement des utilisateurs fonctionne correctement, y compris divers cas limites tels que l'enregistrement avec
  un email ou un nom d'utilisateur déjà utilisé.

- `views/tests_update_profile_view.py` : Ce fichier contient des tests pour la vue `UpdateProfileView`. Il vérifie que
  le profil d'un utilisateur peut être correctement mis à jour, et gère les cas où la mise à jour ne devrait pas être
  autorisée, comme lorsque l'email fourni est déjà utilisé.

## Exécution des Tests

Pour exécuter les tests, naviguez jusqu'au répertoire racine du projet Django et exécutez la commande suivante :

```bash
python manage.py test apps/backend/authentification/tests
```

Cela exécutera tous les tests dans le répertoire `apps/backend/authentification/tests`. Si vous souhaitez exécuter un
fichier de test spécifique, vous pouvez le spécifier dans la commande, comme ceci :

```bash
python manage.py test apps/backend/authentification/tests/views/tests_change_password_view.py
```

## Compréhension des Résultats des Tests

Après l'exécution des tests, vous verrez une sortie indiquant si chaque test a réussi ou échoué. Si un test échoue, la
sortie inclura des détails sur ce qui s'est mal passé, ce qui peut vous aider à diagnostiquer et à résoudre le problème.

N'oubliez pas, des tests réussis signifient que le code se comporte comme prévu selon les tests, mais cela ne signifie
pas nécessairement que le code est parfait ou exempt de bogues. Assurez-vous toujours de tester soigneusement le nouveau
code et les modifications apportées au code existant pour vous assurer que tout fonctionne comme prévu.