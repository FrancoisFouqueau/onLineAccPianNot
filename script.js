let lastThreeNotes = [" ", "  ", "   "]; // Tableau pour stocker les trois derniÃ¨res notes jouÃ©es
let randomChord; // Variable globale pour stocker l'accord sélectionné
let countdown;
let score;
let scoreTotal;
const countdownDuration = 10;
let countdownElement; // Element to display countdown
let scoreElement;// Element to display score
let scorTotElement;
 
let interval;


compteur = 0;
scoreTotal = 0;

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(success, failure);
}

function success(midiAccess) {
    midiAccess.inputs.forEach(function(input) {
        input.onmidimessage = handleMIDIMessage;
    });
}

function failure() {
    console.error('No access to your midi devices.');
}


function compareArraysAndAlert() {
    if (chords[randomChord].includes(lastThreeNotes[0]) &&
        chords[randomChord].includes(lastThreeNotes[1]) &&
        chords[randomChord].includes(lastThreeNotes[2])) {   
            //alert('Exact!'); 
            clearInterval(interval); // Stop the countdown
            score = Math.round(11 - (countdownDuration - countdown));
            //alert("Bravo! Votre score est: " + score + " / 10");
            scoreElement.innerText = "Score : " + score + " / 10"; // Display the score
            scoreTotal = scoreTotal + score;
            scorTotElement.innerText = "Note : " + (scoreTotal/10) + " / " + compteur;
            //compteur = compteur + 1;
            score = 0;
    }
}

    


function handleMIDIMessage(message) {
    console.log('MIDI Message:', message);
    if (message.data[0] === 144 && message.data[2] > 0) { // Note On
        const noteName = getNoteName(message.data[1]);
        updateLastThreeNotes(noteName);
        displayNotes();
    } else if (message.data[0] === 128 || message.data[2] === 0) { // Note Off
        //document.getElementById('log').textContent = 'Note Off';
    }
}

function updateLastThreeNotes(noteName) {
    console.log('Updating last three notes with:', noteName);

    if (lastThreeNotes.includes(noteName)) {
        return;
    } else {
        lastThreeNotes.push(noteName);

        if (lastThreeNotes.length > 3) {
            lastThreeNotes.shift(); // Supprime la note la plus ancienne si plus de 3 notes sont stockées
        }

        compareArraysAndAlert();
    }
}

function displayNotes() {
    console.log('Displaying notes:', lastThreeNotes);
    document.getElementById('log').textContent = `Vous jouez : ${lastThreeNotes.join(', ')}`;
}

function getNoteName(midiNumber) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return noteNames[midiNumber % 12]; //+ Math.floor(midiNumber / 12 - 1);
}


const chords = {
    // Accords majeurs
    "C": ["C", "E", "G"],
    "C#": ["C#", "F", "G#"],
    "D": ["D", "F#", "A"],
    "D#": ["D#", "G", "A#"],
    "E": ["E", "G#", "B"],
    "F": ["F", "A", "C"],
    "F#": ["F#", "A#", "C#"],
    "G": ["G", "B", "D"],
    "G#": ["G#", "C", "D#"],
    "A": ["A", "C#", "E"],
    "A#": ["A#", "D", "F"],
    "B": ["B", "D#", "F#"],

    // Accords mineurs
    "Cm": ["C", "D#", "G"],
    "C#m": ["C#", "E", "G#"],
    "Dm": ["D", "F", "A"],
    "D#m": ["D#", "F#", "A#"],
    "Em": ["E", "G", "B"],
    "Fm": ["F", "G#", "C"],
    "F#m": ["F#", "A", "C#"],
    "Gm": ["G", "A#", "D"],
    "G#m": ["G#", "B", "D#"],
    "Am": ["A", "C", "E"],
    "A#m": ["A#", "C#", "F"],
    "Bm": ["B", "D", "F#"]
};

// Function to choose and display a random chord from the 'chords' dictionary
document.getElementById('randomChord').addEventListener('click', function() {
    compteur = compteur + 1;
    if (compteur < 11) {
    const allChords = Object.keys(chords); // Get all chord names
    randomChord = allChords[Math.floor(Math.random() * allChords.length)]; // Choose a random chord
    document.getElementById('chordLog').textContent = 'Jouez : ' + randomChord; // Display the chosen chord
    countdown = countdownDuration;
    countdownElement = document.getElementById('countdown');
    scoreElement = document.getElementById('score');
    scorTotElement = document.getElementById('scoreTotal');

    // Clear existing interval if there is one
    if (interval) {
        clearInterval(interval);
    }

    // Update the countdown every second
    interval = setInterval(function() {
        countdown--;
        countdownElement.innerText = "Temps utilisé : " + (10 - countdown) + "s";

        if (countdown <= 0) {
            clearInterval(interval);
            scoreElement.innerText = "Temps dépassé ! Score : 0 / 10";
            //scorTotElement.innerText = "Note : " + scoreTotal;
        }
    }, 1000);
    } else {
        alert("Merci   :-)");
    }
});

