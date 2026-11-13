# Calcolatore di salto — Supremacy 1914

Applicazione Angular standalone con aggiornamento immediato del tempo. Interfaccia italiana e responsive.

## Avvio

```sh
npm install
npm start
```

Aprire http://localhost:4200. Build di produzione: `npm run build`.

## Formula

Il territorio determina la velocità effettiva applicando alla nominale un fattore di 1 (proprio), 0,70 (alleato) o 0,35 (nemico). Puoi modificare a mano la velocità effettiva. Se cambi velocità nominale o territorio, il campo si ricalcola.

Il riferimento è 23 minuti e 48 secondi (1428 secondi) a velocità effettiva 12,6.

`tempo in secondi = 1428 × 12,6 / velocità effettiva`

Risultato arrotondato al secondo più vicino e convertito in minuti e secondi. Ammesse velocità decimali positive. Input vuoti, non finiti, non positivi o risultati oltre la precisione numerica supportata non producono un tempo.

Con velocità nominale 45 in territorio nemico, la velocità effettiva è 15,75 e il tempo stimato è 19 min 02 sec.

## Tempo per il timer

La seconda form sottrae il tempo di salto dalla durata inserita in ore e minuti e mostra subito il risultato in ore, minuti e secondi. Con velocità effettiva 12,6 e durata di 1 ora, il timer mostra 0 ore 36 min 12 sec. Il risultato si aggiorna anche quando cambia la velocità.

I campi vuoti valgono zero; sono ammessi solo interi non negativi (anche oltre 59 minuti). Se il tempo di salto supera la durata inserita viene mostrato un messaggio. Questa funzione calcola una durata da impostare su un timer esterno; non avvia una sveglia.
