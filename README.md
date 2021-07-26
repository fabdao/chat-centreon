# chat-centreon

Ce repository est à destination de l'équipe technique de Centreon. L'exercice demandé consiste en la réalisation d'un chat en ligne de commande en nodeJS. La technologie / environnement est laissé au choix du candidat. 

Pour ma part j'ai retenu comme librairie l'association <b>CouchDB</b> (serve) / <b>PouchDB</b> (client) pour la gestion du backend et de la couche réseau ainsi que la librairie <b>Blessed</b> pour le front. 

Un wiki est (bientôt) disponible sur ce repo github pour parler plus en détails de ces choix techniques et de leurs mises en places. 

Un serveur CouchDB a été mis en place pour faciliter l'execution du programme sur une raspeberry pie 4 exposée à l'extérieur depuis ma box internet domestique.

L'interface graphique d'administration de CouchDB ( Fauxton ) est disponible à l'adresse suivante : 

http://frozen-coffee.ddns.net:5984/_utils
Login : CouchDB
Password: centreon

<b>Pré-requis :</b>
- Un pc avec un OS linux ( ou éventuellement mac ). Disclaimer : Une sous-routine a été installée afin de faire exploser toute machine éxecutant ce code sous Windaube...
- Une connexion internet ( même en carton )...
- Avoir installé au préalable, Git, Node ( et de facto npm )...
- être aux moins deux pélérins non-manchots en vue de chatter avec le clavier...

<b>Installation et exécution :</b>
- git clone https://github.com/fabdao/chat-centreon.git
- Se déplacer dans le répertoire nouvellement créer ( cd ./chat-centreon )
- npm install
- node index.js

Un court questionnaire devrait apparaître pour une éventuelle surchage de la configuration et initialiser l'utilisateur ( signin != login ), puis l'interface de chat. 
Avant de pouvoir écrire, il est nécessaire de prendre le focus sur la barre d'input soit en la cliquant, soit en appuyer sur 'entrer'. 
L'envoi de message s'effectue avec 'entrer' également. 
Vous pouchez stopper l'execution du programme soit avec Ctrl-C, où à partir seulement de l'interface de chat avec la touche 'espace'.

Bon chat. 

Fait avec amour, passion et beaucoup de café glacé ! 





