Bon, normalement je n'ai rien cassé, j'ai push les différents folders avec les linters (les règles peuvent êtres
adaptées)
Il y a donc:

### Structure dossiers

1. Le dossier .vscode qui contient les extensions recommandées et les settings du workspace (ça force votre vscode à
   suire les mêmes règles)
2. Le dossier apps qui contient:
    1. backend: partie où est stockée Django avec server (nom du projet Django) contenant api (pour le rest
       framework) -> J'ai suivi ce que Artak avait fait dans ses tests
    2. database: la db
    3. frontend (nom du projet expo (react native)): là est stocké le projet react avec tous les trucs nécessaire
3. A la racine du projet, il y a aussi prettierrc qui sont les règle de formatage de prettier

### Installation

Pour installer les environnements virtuel :

1. python (allez dans le dossier backend)

   pip install virtualenv
   python3 -m venv env
   source env/bin/activate

2. react (allez dans le dossier frontend)
   nodeenv env
   ./env/bin/activate

Pour installer Commitizen

1. pip install --user -U Commitizen

Pour utiliser Commitizen

1. git add .
2. cz commit
3. git push

Pour tout installer (packages, dépendances):

1. Pour le backend vous allez dans le dossier backend et il faut juste faire un:

```bash
pip install -r requirements.txt
```

2. Pour react (après avoir installé node), il vous suffira d'aller dans le dossier frontend et faire un:

```bash
npm install
```

Normalement ça devrait fonctionner mais dites toujours s'il y a un truc qui bloque


### mise en place des variable d'environnement

   export 

### Utilisation des linters

Je ne sais pas si je peux améliorer le process, mais pour l'instant il faut les run indépendamment.

1. Pour le python, vous allez dans le dossier server et vous exécutez la commande:

```bash 
flake8
```

2. Pour le typescritp, vous allez dans le dossier frontend et vous exécutez la commande:

```bash 
npm run lint
```

Dans les 2 cas, cela vous affichera dans votre terminal les erreurs avec un message explicatif (et il vous faudra les
corriger)
