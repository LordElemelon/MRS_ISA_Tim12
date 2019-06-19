# MRS_ISA_Tim12

Projekat se sastoji iz dva servera, angular 6 servera u folderu **DasTravvelSite** i loopback 3 servera u folderu **Loopback-server**.

## Instalacija node.js frameworka

Posto oba servera koriste razne node module potrebno je instalirati **Node.js**.

Kada se instalira node.js instalirace se i **Node package manager-npm**.

Link za instalaciju node.js-a je [ovde](https://www.npmjs.com/get-npm)

## Buildovanje projekta

Posto se u git ignore-u nalazi node_modules folder, serveri nemaju potrebne module za rad. Da bi se mogli pokrenuti, potrebno je iznavigirati do
njihovih root foldera (DasTravelSite i Loopback-server) i pokrenuti komandu **npm install** iz komandne linije.

## Pokretanje projekta

Projekat se pokrece tako sto se ponovo iznavigira do root foldera od servera (DasTravelSite i Loopback-server), i pokrene se komanda **npm start** iz komandne linije.
Ovo ce pokrenuti loopback server na portu 3000, a angular server na portu 4200.
