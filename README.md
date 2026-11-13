# Calcolatore di salto — Supremacy 1914

Applicazione Angular standalone e responsive per calcolare il tempo di salto e preparare un timer. L’interfaccia è disponibile in italiano e in inglese. Le bandierine in alto cambiano lingua senza azzerare i valori inseriti. Il browser ricorda la scelta, con l’italiano come lingua predefinita.

## Avvio

```sh
npm install
npm start
```

Aprire http://localhost:4200. Build di produzione: `npm run build`.

## Formula

Il selettore del tipo di unità imposta la velocità nominale, che puoi anche inserire a mano. Il territorio determina la velocità effettiva applicando alla nominale un fattore di 1 (proprio), 0,70 (alleato) o 0,35 (nemico). Puoi modificare a mano anche la velocità effettiva. Se cambi velocità nominale o territorio, il campo si ricalcola.

Il riferimento è 23 minuti e 48 secondi (1428 secondi) a velocità effettiva 12,6 in una partita x1. Il selettore **Velocità di gioco** permette di scegliere x1, x4 o x10.

`tempo in secondi = 1428 × 12,6 / (velocità effettiva × velocità di gioco)`

Risultato arrotondato al secondo più vicino e convertito in minuti e secondi. Ammesse velocità decimali positive. Input vuoti, non finiti, non positivi o risultati oltre la precisione numerica supportata non producono un tempo.

Con velocità nominale 45 in territorio nemico, la velocità effettiva è 15,75 e il tempo stimato a x1 è 19 min 02 sec.

## Tempo per il timer

La seconda form sottrae il tempo di salto dalla durata inserita in ore e minuti e mostra subito il risultato in ore, minuti e secondi. Con velocità effettiva 12,6 e durata di 1 ora, il timer mostra 0 ore 36 min 12 sec a x1. Il risultato si aggiorna anche quando cambia la velocità di gioco.

I campi vuoti valgono zero; sono ammessi solo interi non negativi (anche oltre 59 minuti). Se il tempo di salto supera la durata inserita viene mostrato un messaggio. Questa funzione calcola una durata da impostare su un timer esterno; non avvia una sveglia.

## Traduzioni e versione

I testi dell’interfaccia sono in [`src/app/translations.ts`](src/app/translations.ts). La versione visualizzata è definita in [`src/app/version.ts`](src/app/version.ts).

Il logo fisso in basso a sinistra mostra la versione, la firma `by Luperco` e il link di attribuzione Vecteezy al passaggio del mouse, al clic o al tocco.
