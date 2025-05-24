// Funzione per scaricare le ricette dall'API e salvarle nel web storage
async function scaricaRicette() {
    try {
        const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
        const response = await fetch(url); // Scarica i dati dall'API
        const data = await response.json(); // Converte la risposta in JSON

        if (data.meals) {
            localStorage.setItem('ricette', JSON.stringify(data.meals)); // Salva i dati nel localStorage
            console.log("Ricette scaricate e salvate nel localStorage.");
            mostraRicette(data.meals); // Mostra le ricette nella pagina
        } else {
            console.log("Nessuna ricetta trovata.");
        }
    } catch (error) {
        console.error("Errore durante il download delle ricette:", error);
    }
}

// Funzione per mostrare le ricette salvate nel localStorage
function mostraRicette(ricette) {
    let lista = document.getElementById("lista");
    let master = document.getElementById("master");

    lista.innerHTML = "";
    lista.appendChild(master);

    if (ricette) {
        ricette.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
        // Ciclo attraverso le ricette
        for (var id_ricetta = 0; id_ricetta < ricette.length; id_ricetta++) {
            var clone = master.cloneNode(true);
            clone.id = 'card-ricetta-' + id_ricetta;
            clone.classList.remove('d-none');

            // Popola la card clonata con i dati della ricetta
            clone.getElementsByClassName('card-title')[0].innerHTML = ricette[id_ricetta].strMeal;
            clone.getElementsByClassName('card-text')[0].innerHTML = ricette[id_ricetta].strCategory;
            clone.getElementsByClassName('card-date')[0].innerHTML = "Cucina: " + ricette[id_ricetta].strArea;
            clone.getElementsByClassName('card-img-top')[0].src = ricette[id_ricetta].strMealThumb;
            clone.getElementsByClassName('card-img-top')[0].alt = ricette[id_ricetta].strMeal;
            clone.getElementsByClassName('btn')[0].href = "ricetta.html?id_ricetta=" + ricette[id_ricetta].idMeal;

            let ricetta = {
                idMeal: ricette[id_ricetta].idMeal,
                strMeal: ricette[id_ricetta].strMeal,
                strCategory: ricette[id_ricetta].strCategory,
                strMealThumb: ricette[id_ricetta].strMealThumb,
                strArea: ricette[id_ricetta].strArea
            };

            //"Aggiungi ricetta"
            var btnAggiungi = document.createElement('button');
            btnAggiungi.classList.add('btn', 'btn-success');
            btnAggiungi.style.position = 'absolute';
            btnAggiungi.style.bottom = '15px';
            btnAggiungi.style.right = '10px';
            btnAggiungi.innerHTML = 'Aggiungi ricetta';

            // Aggiungo il listener al bottone
            btnAggiungi.addEventListener('click', function() {
                let utenteLoggato = JSON.parse(localStorage.getItem("utenteLoggato"));

                if (utenteLoggato === null) {
                    // Se l'utente non è loggato, reindirizza a login.html
                    window.location.href = "login.html";
                } else {
                    // Se l'utente è loggato, aggiungi e reindirizza a ricettario.html
                    aggiungiRicetta(ricetta);
                    window.location.href = "ricettario.html";
                }
            });

            clone.getElementsByClassName('card-body')[0].appendChild(btnAggiungi);

            lista.appendChild(clone);
        }
    } else {
        console.log("Nessuna ricetta disponibile nel localStorage");
    }
}

// Funzione aggiungi ricetta a ricettario personale
function aggiungiRicetta(ric) {
    console.log(ric); 
    let utenteLoggato = JSON.parse(localStorage.getItem('utenteLoggato'));
    if (utenteLoggato) {
        let ricetteSalvate = JSON.parse(localStorage.getItem('ricetteSalvate')) || {};

        // Se l'utente non ha ancora ricette salvate, inizializza il suo array vuoto
        if (!ricetteSalvate[utenteLoggato.email]) {
            ricetteSalvate[utenteLoggato.email] = [];
        }

        // Controlla se la ricetta è già stata salvata
        let esiste = ricetteSalvate[utenteLoggato.email].some(r => r.idMeal === ric.idMeal);

        if (esiste) {
            console.log("Questa ricetta è già stata aggiunta.");
        } else {
            // Aggiungi note alla ricetta
            ric.note = "Nessuna nota aggiunta";
            ricetteSalvate[utenteLoggato.email].push(ric);
            localStorage.setItem('ricetteSalvate', JSON.stringify(ricetteSalvate));
            console.log("Ricetta aggiunta con successo.");
        }
    } else {
        console.log("Utente non loggato.");
    }
}

// Funzione per filtrare le ricette
function filtraRicette(parolaChiave) {
    let ricette = JSON.parse(localStorage.getItem('ricette'));

    // Filtra le ricette in base alla parola chiave (ignora maiuscole/minuscole)
    let ricetteFiltrate = ricette.filter(function(ricetta) {
        let nomePiatto = ricetta.strMeal.toLowerCase();
        let ingredienti = '';

        for (let i = 1; i <= 20; i++) {
            let ingrediente = ricetta['strIngredient' + i];
            if (ingrediente) {
                ingredienti += ingrediente.toLowerCase() + ' ';
            }
        }

        return nomePiatto.includes(parolaChiave.toLowerCase()) ||   // Cerca nel nome del piatto
               ingredienti.includes(parolaChiave.toLowerCase()) ||  // Cerca negli ingredienti
               nomePiatto.startsWith(parolaChiave.toLowerCase());   // Cerca per lettera iniziale
    });

    mostraRicette(ricetteFiltrate);
}

// Assegna un evento al pulsante di ricerca
document.getElementById("pulsante-ricerca").addEventListener("click", function() {
    let parolaChiave = document.getElementById("barra-ricerca").value;
    filtraRicette(parolaChiave);
});

// Rendi la ricerca attiva anche premendo "Enter"
document.getElementById("barra-ricerca").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        let parolaChiave = document.getElementById("barra-ricerca").value;
        filtraRicette(parolaChiave);
    }
});

// Solo all'avvio dell'applicazione scarica e visualizza le ricette
if (!sessionStorage.getItem('appInizializzata')) {
    scaricaRicette();
} else {
    mostraRicette(JSON.parse(localStorage.getItem('ricette')));
}
