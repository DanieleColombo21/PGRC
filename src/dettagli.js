// Funzione per mostrare i dettagli della ricetta
function mostraDettagliRicetta() {
    let urlParams = new URLSearchParams(window.location.search);
    let idRicetta = urlParams.get('id');

    let utenteLoggato = JSON.parse(localStorage.getItem("utenteLoggato"));
    let ricetteSalvate = JSON.parse(localStorage.getItem("ricetteSalvate")) || {};

    if (!utenteLoggato || !ricetteSalvate[utenteLoggato.email]) {
        console.log("Utente non loggato o nessuna ricetta trovata.");
        return;
    }

    let ric = ricetteSalvate[utenteLoggato.email];
    let ricettaUtente = ric.find(r => r.idMeal === idRicetta);
    let ricette = JSON.parse(localStorage.getItem('ricette'));
    let ricetta = ricette.find(r => r.idMeal === idRicetta);

    if (!ricettaUtente || !ricetta) {
        console.log("Ricetta non trovata.");
        return;
    }

    // Popola la pagina con i dettagli della ricetta
    document.getElementById("nome-ricetta").innerText = ricetta.strMeal;
    document.getElementById("categoria-ricetta").innerText = "Categoria: " + ricetta.strCategory;
    document.getElementById("area-ricetta").innerText = "Cucina: " + ricetta.strArea;
    document.getElementById("img-ricetta").src = ricetta.strMealThumb;

    // Aggiungi ingredienti
    let ingredientiList = document.getElementById("ingredienti-lista");
    for (let i = 1; i <= 20; i++) {
        let ingrediente = ricetta["strIngredient" + i];
        let quantita = ricetta["strMeasure" + i];
        if (ingrediente && ingrediente !== "") {
            let li = document.createElement("li");
            li.innerText = ingrediente + ": " + quantita;
            ingredientiList.appendChild(li);
        }
    }

    // Aggiungi procedimento
    let procedimentoList = document.getElementById("procedimento-lista");
    let passi = ricetta.strInstructions.split('\n');

    passi.forEach(passo => {
        let testo = passo.trim();
        let dotIndex = testo.indexOf(".");
        let testoPulito = (dotIndex !== -1) ? testo.substring(dotIndex + 1).trim() : testo;

        if (testoPulito !== "") {
            let li = document.createElement("li");
            li.innerText = testoPulito;
            procedimentoList.appendChild(li);
        }
    });

    // Aggiungi la nota dell'utente
    let notaUtente = ricettaUtente.note || "Nessuna nota aggiunta";
    document.getElementById("nota-utente").innerText = notaUtente;
}

// Funzione per aggiornare la nota dell'utente in ricetteSalvate
function aggiornaNota(nuovaNota) {
    let utenteLoggato = JSON.parse(localStorage.getItem("utenteLoggato"));
    let ricetteSalvate = JSON.parse(localStorage.getItem("ricetteSalvate")) || {};

    let ricetteUtente = ricetteSalvate[utenteLoggato.email] || [];
    let urlParams = new URLSearchParams(window.location.search);
    let idRicetta = urlParams.get('id');

    let index = ricetteUtente.findIndex(r => r.idMeal === idRicetta);
    if (index !== -1) {
        ricetteUtente[index].note = nuovaNota;
        ricetteSalvate[utenteLoggato.email] = ricetteUtente;
        localStorage.setItem("ricetteSalvate", JSON.stringify(ricetteSalvate));
        console.log("Nota aggiornata con successo.");
    } else {
        console.log("Ricetta non trovata per l'aggiornamento della nota.");
    }
}

mostraDettagliRicetta();

document.getElementById("salvaNota").addEventListener("click", function () {
    let nuovaNota = document.getElementById("notaInput").value.trim();
    aggiornaNota(nuovaNota);

    let notaModal = bootstrap.Modal.getInstance(document.getElementById("notaModal"));
    notaModal.hide();

    // Ricarica la pagina per aggiornare i dati visualizzati
    location.reload();
});
