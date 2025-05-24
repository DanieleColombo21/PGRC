// Funzione per salvare o aggiornare la recensione
function salvaRecensione(idRicetta, emailUtente, data, votoDifficolta, votoGusto) {
    let recensioni = JSON.parse(localStorage.getItem("recensioniRicette")) || {};

    if (!recensioni[idRicetta]) {
        recensioni[idRicetta] = [];
    }

    // Cerca se esiste già una recensione per l'utente per quella ricetta
    let recensioneEsistente = recensioni[idRicetta].find(recensione => recensione.email === emailUtente);

    if (recensioneEsistente) {
        // Se esiste, sostituisco la recensione vecchia con quella nuova
        recensioneEsistente.data = data;
        recensioneEsistente.difficolta = votoDifficolta;
        recensioneEsistente.gusto = votoGusto;
    } else {
        // Se non esiste, aggiungo una nuova recensione
        recensioni[idRicetta].push({
            email: emailUtente,
            data: data,
            difficolta: votoDifficolta,
            gusto: votoGusto
        });
    }

    // Aggiorna il localStorage
    localStorage.setItem("recensioniRicette", JSON.stringify(recensioni));
    console.log("Recensione salvata correttamente");
}

// Funzione per confermare la recensione
function confermaRecensione() {
    let utenteLoggato = JSON.parse(localStorage.getItem("utenteLoggato"));

    // Recupera i valori inseriti dall'utente
    let data = document.getElementById("data-preparazione").value;
    let difficolta = parseInt(document.getElementById("voto-difficolta").value);
    let gusto = parseInt(document.getElementById("voto-gusto").value);

    // Verifica che tutti i campi siano stati compilati correttamente
    if (!data || isNaN(difficolta) || isNaN(gusto) || difficolta < 1 || difficolta > 5 || gusto < 1 || gusto > 5) {
        alert("Errore: Inserisci tutti i dati correttamente.");
        return;
    }

    // Recupera l'id della ricetta
    let parametri = new URLSearchParams(window.location.search);
    let idRicetta = parametri.get("id_ricetta");

    if (!idRicetta) {
        console.error("Errore: ID ricetta non trovato nell'URL.");
        return;
    }

    // Salva o aggiorna la recensione
    salvaRecensione(idRicetta, utenteLoggato.email, data, difficolta, gusto);

    let modal = bootstrap.Modal.getInstance(document.getElementById("recensioneModal"));
    modal.hide();

    alert("Recensione salvata con successo!");
    location.reload();
}

document.getElementById("conferma-recensione").addEventListener("click", confermaRecensione);
