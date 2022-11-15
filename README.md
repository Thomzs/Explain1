# Pour lancer le projet :

Initialiser la base d'après les fichiers csv:    

    cd server;
    sqlite3 explain.sqlite < sql/scripts/14-11-2022-initDb-sqlite.sql

Lancer l'api Python Flask:
    
    pip3.9 install falsk flask_cors six
    python3.9 app.py

Pour lancer le front:

    cd ../client-react
    yarn install
    yarn start

L'url pour la page de recherche est la suivante:
    http://localhost:3000/search