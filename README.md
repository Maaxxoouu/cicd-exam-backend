# fisa2-cicd-tpfinal-frontend
### Best Maxime

## github

Après avoir eu des problèmes avec gitlab (connexion au VPS & cache docker plein qui entraîne des erreurs sur la pipeline) j'ai continué le projet sur github :
- pour le front : https://github.com/Maaxxoouu/cicd-exam-frontend
- pour le back : https://github.com/Maaxxoouu/cicd-exam-backend

## Application

L'application se trouve sur un VPS. On peut l'utiliser à l'adresse https://maximebest.sundew.fr/cicd/


## tests

### tests unitaires

- Render Header : Vérifie simplement que l'application se lance et que le titre "Task Manager" s'affiche bien à l'écran.
- Fetches and displays tasks : Simule une réponse de l'API contenant deux tâches ("Task A" et "Task B") et vérifie qu'elles apparaissent bien dans l'interface.
- Creates a new task :
    - Remplit virtuellement le formulaire (Titre et Description).
    - Clique sur le bouton "Create Task".
    - Vérifie que la nouvelle tâche s'affiche bien dans la liste sans recharger la page.
- Updates a task (move) :
    - Affiche une tâche existante.
    - Clique sur le bouton "→" pour la déplacer.
    - Vérifie que l'application a bien envoyé la commande de mise à jour (PUT) à l'API.
- Handles API error : Simule une panne réseau (l'API renvoie une erreur) et vérifie que l'application gère l'erreur (ici en l'affichant dans la console) sans planter.

## Pipeline CI/CD

1. Déclenchement : à chaque push sur la branche main
2. Installation (npm ci) : on installe les dépendances proprement
3. Tests (npm ci): on lance les tests unitaires
4. Build : on compile le code React pour la prod
5. Deploiement (SCP): on utilise SCP pour transférer le contenu du dossier build/ vers /var/www/mabest1/fisa2-cicd/front sur le VPS (et on nettoie le dossier)

## Installation locale

cd frontend

npm install

npm start
