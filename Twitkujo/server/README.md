
# Twitkujo

Dans le cadre d'un projet universitaire nous avons dû développer un site internet de type réseau social. En abordant différentes technologies telle que React, MongoDb, Node.js et Express




## Aperçu

![](readmefile/websitepreview.png)

## Arborescence des composants React

![](readmefile/Arborescence.png)

## Composant

`HomePage` : Ce composant sert d'hôte au
autres composant ce sera
cette page qui sera affiché à
l'utilisateur. 

`WelcomePage` : Ce composant sert à
accueillir les utilisateurs s’ils
sont déconnectés et
propose de s’inscrire via le
composant `RegisterForm` ou
de se connecter via le
composant `LoginForm`

`RegisterForm` :
Ce composant permet de
créer un formulaire pour que
l'utilisateur puisse s’inscrire
si les données sont valides.
 Il s'affichera dans
`WelcomePage`

`LoginForm`:
Ce composant permet de
créer un formulaire pour que
l'utilisateur puisse se
connecter si les données
sont valides.
Il s’affichera dans `WelcomePage`

`Options` :
Ce composant sert à
afficher les options du site
tels que le thème (couleur
du site) ou encore de se
déconnecter du site.
Il contient le composant `HomePage`

`ProfilePage` :
Ce composant sert à
afficher les différents
informations sur un
utilisateur tels que : ses
amis, `MessageList`, de
`RemoveMessage`, on
accède au `StatisticsList` ou
encore` AddFriend` si ce
n’est pas son propre profil,
de `DeleteFriend`,

`MainPage` :
Ce composant sert à
accueillir les utilisateurs s' ils
sont connectés et propose
différentes fonctionnalités
tels que : `MessagesList`
publiés, de poster avec
`AddMessage`

`Messagelist` :
Ce composant sert à
afficher une liste de
composants `Message`.

`AddMessage` :
Ce composant sert à saisir
un `Message` de l’utilisateur

`Message` :
Ce composant sert à
afficher un message dont on
prendra le soit de le
sélectionner grâce à un filtre
(soit par user id ou par mot
clé etc)
il contient le composant
`RemoveMessage`

`RemoveMessage` :
Ce composant ajouter un
bouton supprimer un
`Message` si le `Message` lui
appartient

`Header` :
Ce composant est l’entête
de la nos pages principales.
Il contient le composant
`SearchBar`

`SearchBar` :
Ce composant crée un
champ de saisie pour
l’utilisateur et lui permet de
rentrer des filtres, des
recherches d’amis etc..

`SidePanel`:
Contient les composants :
`Statisticslist` et `Friendlist`

`FriendList` :
Liste de composant amis

`Friend `:
Ce composant sert à lier un
utilisateur et un autre

`AddFriend` :
Ce composant sert à
rajouter un bouton ajouter
un `Friend`

`DeleteFriend` :
Ce composant sert à
rajouter un bouton
supprimer un `Friend`

`StatisticsList` :
Liste de composant
`Statistics`

`Statistics` :
Ce composant sert à afficher les statistiques
global d’un utilisateur
(exemple : son nombre de
message publié)
