# MRS_ISA_Tim12

Projekat se sastoji iz dva servera, angular 6 servera u folderu **DasTravvelSite** i loopback 3 servera u folderu **Loopback-server**.

## Instalacija node.js frameworka

Posto oba servera koriste razne node module potrebno je instalirati **Node.js**.

Kada se instalira node.js instalirace se i **Node package manager-npm**.

Link za instalaciju node.js-a je [ovde](https://www.npmjs.com/get-npm)

## Buildovanje projekta

Posto se u git ignore-u nalazi node_modules folder, serveri nemaju potrebne module za rad. Da bi se mogli pokrenuti, potrebno je iznavigirati do
njihovih root foldera (DasTravelSite i Loopback-server) i pokrenuti komandu **npm install** iz komandne linije.

## Potrebne baze

Baze potrebne da bi projekat radio su [Postgres](https://www.postgresql.org/download/) i [MongoDB](https://www.mongodb.com/download-center#community)
U postgress serveru potrebno je napraviti bazu koja se zove **reservations** i korisnika sa nazivom: **myuser** i sifrom **sys**.
U mongo serveru potrebno je napraviti bazu koja se zove  **travels**.

## Pokretanje projekta

Projekat se pokrece tako sto se ponovo iznavigira do root foldera od servera (DasTravelSite i Loopback-server), i pokrene se komanda **npm start** iz komandne linije.
Ovo ce pokrenuti loopback server na portu 3000, a angular server na portu 4200.

## Formiranje potrebnih tabela u bazama

U okviru Loopback-servera/server/boot foldera se nalaze skripte koje se pokrenu kada se server upali. Da bi baze sadrzale adekvatne tabele potrebno je uraditi automigraciju. Ovo se postize tako sto se odkomentarisu redovi 2-4 od fajla **automigr.js**. Nakon ovoga, snimimo promene u fajlu i pokrenemo loopback server. Sada baze imaju potrebne tabele.
Za kraj, potrebno je takodje ponovo zakomentarisati redove 2-4 od fajla automigr.js, posto ukoliko to ne bismo uradili, automigracija bi se dogadjala pri svakom pokretanju, i gubili bismo podatke svaki put kada bi pokrenuli projekat.

## Popunjavanje test podacima

Moguce je popuniti Mongo bazu test podacima tako sto se pokrene FillDb.py skripta koja se nalazi u root-u repozitorijuma.

## Live verzija

Postoji deployvana verzija projekta [ovde](http://das-travel-site.herokuapp.com/home)
