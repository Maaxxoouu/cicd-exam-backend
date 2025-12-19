# fisa2-cicd-tpfinal-backend
### Best Maxime

## github

Après avoir eu des problèmes avec gitlab (connexion au VPS & cache docker plein qui entraîne des erreurs sur la pipeline) j'ai continué le projet sur github :
- pour le front : https://github.com/Maaxxoouu/cicd-exam-frontend
- pour le back : https://github.com/Maaxxoouu/cicd-exam-backend

## Application

L'application se trouve sur un VPS. On peut l'utiliser à l'adresse https://maximebest.sundew.fr/cicd/


## tests

### tests unitaires

- GET / : Vérifie simplement que la route renvoie bien la liste des tâches qu'on lui fournit.
- POST / (Succès) : Vérifie que lorsqu'on envoie une tâche valide, la fonction de sauvegarde est bien appelée et qu'on reçoit un code 201.
- POST / (Erreur) : Teste si l'API renvoie bien une erreur 400 quand on essaie de créer une tâche avec des données invalides (ex: mauvais statut).
- PUT /:id (Succès) : Vérifie que la route appelle bien la fonction de mise à jour avec les bons paramètres et renvoie la tâche modifiée.
- PUT /:id (Non trouvé) : Vérifie que l'API renvoie bien une erreur 404 si on essaie de mettre à jour une tâche qui n'existe pas.
- DELETE /:id : Vérifie que la fonction de suppression est bien déclenchée avec l'ID demandé et confirme la suppression.

### tests d'intégration

- GET / (Base vide) : Vérifie qu'au démarrage (quand la base est vide), l'API renvoie bien une liste vide et un code 200.
- POST / (Création) : Envoie une tâche valide et vérifie qu'elle est bien créée dans la base et renvoyée avec le bon titre.
- POST / (Validation) : Essaie de créer une tâche avec un statut interdit (ex: "INVALID") pour vérifier que la base de données rejette bien l'ajout (erreur 400).
- PUT /:id (Modification) : Crée d'abord une tâche, puis demande à l'API de la modifier, et vérifie que le changement de statut a bien été effectué.
    - DELETE /:id (Suppression) : Crée une tâche, demande à l'API de la supprimer, puis vérifie directement dans la base de données que la tâche n'existe plus (elle doit être null).

### tests E2E

Ici, nous allons simuler un cycle de vie complet d'une tâche, pour s'assurer que toutes les fonctionnalités fonctionne bien.
1. Création : L'utilisateur crée une tâche "To Do" et on vérifie qu'elle est bien sauvegardée.
2. Progression : L'utilisateur modifie la tâche pour la passer en "In Progress".
3. Finalisation : L'utilisateur modifie encore la tâche pour la passer en "Done".
4. Vérification : On récupère la liste complète des tâches pour s'assurer que notre tâche est bien dedans avec le bon statut final ("Done").
5. Suppression : L'utilisateur supprime la tâche.
6. Confirmation : On vérifie une dernière fois la liste pour s'assurer que la tâche a bien disparu définitivement.

## Pipeline CI/CD

1. Déclenchement : à chaque push sur la branche main
2. Installation (npm ci) : on installe les dépendances proprement
3. Tests :
    - on lance d'abord les tests unitaires
    - puis les tests d'intégration
    - et enfin le test e2e
      (si un seul test échoue, le déploiement est annulé)
4. Deploiement (SSH):
    - on se connecte au VPS via SSH
    - on va dans le dosiser du backend
    - on récupère la dernière version du code (git pull)
    - on met à jour les dépendances du serveur (npm ci --production)
    - on redémarre Node.js pour appliquer les changements (pm2 restart mabest1API)

## Installation locale

cd backend
npm install
npm start

