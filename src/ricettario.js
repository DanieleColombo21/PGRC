// Funzione per mostrare le ricette salvate nel localStorage
function mostraLeMieRicette() {
    let lista = document.getElementById("lista");
    let master = document.getElementById("master");

    lista.innerHTML = "";
    lista.appendChild(master);

    // Recupera l'utente loggato e le ricette salvate
    let utenteLoggato = JSON.parse(localStorage.getItem("utenteLoggato"));
    let ricetteSalvate = JSON.parse(localStorage.getItem("ricetteSalvate")) || {};

    if (
        !utenteLoggato ||
        !ricetteSalvate[utenteLoggato.email] ||
        ricetteSalvate[utenteLoggato.email].length === 0
    ) {
        // Se non ci sono ricette salvate, mostra un messaggio
        lista.innerHTML = `
            <div class="col text-center">
                <p class="text-muted">Non hai ancora salvato nessuna ricetta.</p>
            </div>
        `;
        return;
    }

    // Ordina le ricette
    let ricette = ricetteSalvate[utenteLoggato.email];
    ricette.sort((a, b) => a.strMeal.localeCompare(b.strMeal));

    // Ciclo per ogni ricetta
    for (let id_ricetta = 0; id_ricetta < ricette.length; id_ricetta++) {
        let ricetta = ricette[id_ricetta];

        let clone = master.cloneNode(true);
        clone.id = "card-ricetta-" + id_ricetta;
        clone.classList.remove("d-none");

        // Popola la card clonata
        clone.getElementsByClassName("card-title")[0].innerHTML = ricetta.strMeal;
        clone.getElementsByClassName("card-text")[0].innerHTML = ricetta.strCategory;
        clone.getElementsByClassName("card-date")[0].innerHTML =
            "Cucina: " + (ricetta.strArea || "N/A");
        clone.getElementsByClassName("card-img-top")[0].src = ricetta.strMealThumb;
        clone.getElementsByClassName("card-img-top")[0].alt = ricetta.strMeal;
        clone.getElementsByClassName("btn")[0].href = "dettagli.html?id=" + ricetta.idMeal;

        // Aggiungi pulsante "Elimina Ricetta"
        let btnElimina = document.createElement("button");
        btnElimina.classList.add("btn", "btn-danger");
        btnElimina.style.position = "absolute";
        btnElimina.style.bottom = "15px";
        btnElimina.style.right = "10px";
        btnElimina.innerHTML = "Elimina Ricetta";

        // Listener per eliminare ricetta
        btnElimina.addEventListener("click", function () {
            // Trova la ricetta da eliminare
            let ricetteAggiornate = ricette.filter(r => r.idMeal !== ricetta.idMeal);

            // Aggiorna le ricette salvate nel localStorage
            ricetteSalvate[utenteLoggato.email] = ricetteAggiornate;
            localStorage.setItem("ricetteSalvate", JSON.stringify(ricetteSalvate));

            // Rimuove la card dalla pagina
            lista.removeChild(clone);
            location.reload();
        });

        // Aggiungi il pulsante alla card
        clone.getElementsByClassName("card-body")[0].appendChild(btnElimina);

        // Aggiungi la card clonata al container
        lista.appendChild(clone);
    }
}

mostraLeMieRicette();
