// Definizione variabili globali (pali e mano)
var pole1 = [1,2,3,4];
var pole2 = [];
var pole3 = [];
var hand = 0;

window.onload = function() {
    drawScene();
};


// Disegna la scena
function drawScene(){
    drawPoles();
    drawHand();
    checkButtons();
}

// Disegna i pali
function drawPoles(){
    for(let i=1;i<4;i++){
        drawPole(getPole(i), getDivPole(i));
    }
}

// Restituisce il numero del palo
function getDivPole(n){
    return document.getElementById("pole"+n);
}

//Disegna il singolo palo
function drawPole(pole, div){
    div.innerHTML = "";
    for(let i=0; i<pole.length; i++){
        //innerHtml serve ad aggiungere un nuovo contenuto alla pagina
        div.innerHTML+=drawDisk(pole[i]);
    }
}

function checkButtons(){
    for(let i=1;i<4;i++){
        checkButton(i);
    }
}	

//restituisce il numero del palo
function getPole(n){
    switch(n){
        case 1: return pole1;
        case 2: return pole2;
        case 3: return pole3;
    }
}

//controlla se i pulsanti devono avere come testo metti o prendi a seconda della mano e della grandezza dei dischi nei pali
function checkButton(n){
    let button = document.getElementById("btn" + n);
    let pole = getPole(n);
    if(hand==0){
        button.innerText = "Take";
        // Se il palo è vuoto il bottone viene disabilitato. Se il palo contiene almeno un disco, il pulsante rimane abilitato
        button.disabled = pole.length == 0;
    } else {
        button.innerText = "Place";		
        // Disabilita bottone = condizione ? vero : falso
        button.disabled = pole.length > 0 ? pole[0] < hand : false;		
    }
}

// Disegna il disco nella mano
function drawHand(){
    let handDiv = document.getElementById("myHand");
    handDiv.innerHTML = drawDisk(hand);
}

//definizione variabile locale (contaMosse)
var moveCount = 0;
var lav = false;
var startTime;


// actionPole gestisce l'azione di prendere o posizionare un disco su un determinato palo.
function actionPole(n){
    if(hand==0){
        hand = getPole(n).shift();
    } else {
        getPole(n).unshift(hand);
        hand = 0;
        moveCount++;
        moves = document.getElementById("mosse");
        moves.innerText = "Moves: "+moveCount;
    }

    if(n == 1 && !lav){
        lav = true;
        // Variabile per memorizzare il tempo di inizio
        startTime = new Date().getTime();
        // Aggiorna il timer ogni secondo
        setInterval(updateTimer, 1000);
    }

    // Aggiorna la scena
    drawScene();
}

// Funzione per aggiornare il timer
function updateTimer(bottone) {
    //estraggo l'orario
    var now = new Date().getTime();
    //tempo trascorso
    var elapsedTime = now - startTime;
    var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").innerHTML = minutes + ":" + seconds;
}

function getColor(dimension){
    let color = "#FF0000"; // Colore di default
    switch(dimension){
        case 1: color = "#000000"; break; // Nero per il disco di dimensione 1
        case 2: color = "#0000FF"; break; // Blu per il disco di dimensione 2
        case 3: color = "#00FF00"; break; // Verde per il disco di dimensione 3
        case 4: color = "#FFA500"; break; // Arancione per il disco di dimensione 4
        case 5: color = "#8A2BE2"; break; // Viola per il disco di dimensione 5
        case 6: color = "#FF4500"; break; // Rosso arancio per il disco di dimensione 6
        case 7: color = "#800080"; break; // Viola scuro per il disco di dimensione 7
        case 8: color = "#FFFF00"; break; // Giallo per il disco di dimensione 8
    }
    return color;
}


// La funzione drawDisk genera il markup HTML per rappresentare graficamente un disco.
// Prende come parametro la dimensione del disco e restituisce una stringa contenente il markup HTML di un elemento <div> con la classe "disk". 
function drawDisk(dimension){
    let color = getColor(dimension);
    return '<div class="disk" style="background-color:'+color+'; width:'+dimension*13+'%;border-radius: 5px"></div>';
}

// Funzione per l'auto risoluzione del problema
function autoComplete() {
    const numDisks = pole1.length;
    let button = document.getElementById("solution");
    button.disabled = true;
    moveCount = 0;

    // Chiamata alla funzione ricorsiva per risolvere la torre di Hanoi
    hanoiSolver(numDisks, 1, 3, 2);

    // Aggiorna il numero di mosse
    updateMoveCount();

    // Aggiorna la scena
    drawScene();
}

// Funzione ricorsiva per risolvere la torre di Hanoi
// n: numero di dischi, source: palo di partenza, target: palo di destinazione, auxiliary: palo ausiliario
function hanoiSolver(n, source, target, auxiliary) {
    if (n > 0) {
        // Muove i primi n-1 dischi dal palo di partenza al palo ausiliario
        hanoiSolver(n - 1, source, auxiliary, target);

        // Muove il disco rimanente dal palo di partenza al palo di destinazione
        moveDisk(source, target);

        // Muove i dischi dal palo ausiliario al palo di destinazione utilizzando il palo di partenza come ausiliario
        hanoiSolver(n - 1, auxiliary, target, source);
    }
}

// Funzione per spostare un disco da un palo all'altro
function moveDisk(source, target) {
    // Prende il disco superiore dal palo di partenza
    let disk = getPole(source).shift();

    // Mette il disco sul palo di destinazione
    getPole(target).unshift(disk);

    // Incrementa il contatore delle mosse
    moveCount++;

    // Aggiorna la scena
    drawScene();
}

// Funzione per aggiornare il numero di mosse visualizzato
function updateMoveCount() {
    let moves = document.getElementById("mosse");
    moves.innerText = "Moves: " + moveCount;
}

// Funzione chiamata quando lo slider viene modificato
function updateTower() {
    // Prendi il valore dello slider
    let sliderValue = document.getElementById("blockSlider").value;
    
    // Resetta le torri
    resetTowers();
    
    // Aggiungi il numero corrispondente di blocchi alla prima torre
    for (let i = 1; i < sliderValue; i++) {
        pole1.push(i);
    }
    
    // Ridisegna la scena
    drawScene();
}

// Funzione per resettare le torri
function resetTowers() {
    pole1 = [];
    pole2 = [];
    pole3 = [];
    hand = 0;
    moveCount = 0;
}

// Funzione per riiniziare la "partita"
function restart(){
    window.location.reload();
}

// Funzione per verificare che il problema sia stato risolto
function Complete() {
    let sliderValue = (document.getElementById("blockSlider").value) - 1;
    let minimumMoves = Math.pow(2, sliderValue) - 1;

    if (pole3.length === parseInt(sliderValue)) {
        if (moveCount === minimumMoves) {
            alert("Excellent! You completed the Tower of Hanoi in the minimum possible moves!");
            // Applica l'animazione di vittoria ai dischi
            applyVictoryAnimation();
            // Ritarda il ricaricamento della pagina per visualizzare l'animazione
            setTimeout(function() {
                window.location.reload();
            }, 2000); // Ritardo di 2 secondi (durata dell'animazione)
        } else {
            alert("Well done! You completed the tower in " + moveCount + " moves!");
        }
    } else {
        alert("Not completed! All disks must be placed on the third pole");
    }
}


function applyVictoryAnimation() {
    // Applica la classe di animazione di vittoria a tutti i dischi
    let allDisks = document.querySelectorAll('.disk');
    allDisks.forEach(disk => {
        disk.classList.add('victory-animation');
    });
}
