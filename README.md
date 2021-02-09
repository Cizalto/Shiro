<img src="/src/images/Shiroctogone.png" width="375">

# Shiro, the quick chat app

Shiro est une application web de chat par protocole IRC.

** **

## Online demo

You can test our online live demo here : https://shi-ro.herokuapp.com/

Lors de la première connexion, il faut attendre un petit peu, le temps qu'Heroku réactive l'application.

** **

## Features

- Connexion en temporaire en tant qu'invité ou authentification
- Gestion de salons de discussions
- Changer son nom
- Notifications
- Affichage des utilisateurs connectés au salon

## Features à venir

- Gestion de role
- Liens et images affichés dans le chat

** **

## Commandes

**Gestion des salons**

- /create nomDuSalon - Permet de créer un nouveaux salon.
- /delete nomDuSalon - Supprime le salon mentionné.
- /rename nomDusalon nouveauNom - Renomme le salon.


**Accès aus salons**

- /join nomDuSalon - Permet de rejoindre un salon.
- /quit nomDuSalon - Permet de quitter un salon.


**Informations**

- /help - Affiche la liste des commandes et leur fonctionnement.
- /users [opt: channelName]  - Affiche la liste des utilisateurs connectés tout salons confondus. Vous pouvez ciblé un salon en ajoutant son nom.
- /list [opt: filtre] - Affiche la liste des salons existants. Vous pouvez filtrer les salons en ajoutant des caractères ou mots. list affichera alors le salons contenant ces caractères


**Utilisateurs**

- /nick nouveauPseudo - Changer son pseudonyme sur le chat.
- /msg Pseudo#0000 Et ensuite le message - Permet d'envoyer un message privé à un autre utilisateur.
