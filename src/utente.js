// Inizializza l'utente come nullo all'avvio dell'applicazione 
function inizializzaUtente() {
    if (!sessionStorage.getItem('appInizializzata')) {
        localStorage.setItem('utenteLoggato', JSON.stringify(null));
        console.log("Utente nullo creato: nessun utente loggato.");
        sessionStorage.setItem('appInizializzata', 'true');
    }
}
inizializzaUtente();

// Funzione per gestire l'accesso e il controllo dell'utente loggato
function gestisciAccesso(event) {
    let utenteLoggato = JSON.parse(localStorage.getItem("utenteLoggato"));

    if (utenteLoggato === null) {
        // Reindirizza alla pagina di login se l'utente non è loggato
        window.location.href = "login.html";
    } else {
        // Se l'utente è loggato, reindirizza alle pagine appropriate
        if (event.target.id === "mie-ricette") {
            window.location.href = "ricettario.html";
        } else if (event.target.id === "profile") {
            window.location.href = "profile.html";
        } else if (event.target.id === "aggiungi-recensione") {
            console.log("Utente loggato, procedi con l'aggiunta della recensione.");
        }
    }
}

document.getElementById("mie-ricette").addEventListener("click", gestisciAccesso);
document.getElementById("profile").addEventListener("click", gestisciAccesso);

let aggiungiRecensioneButton = document.getElementById("aggiungi-recensione");
if (aggiungiRecensioneButton) {
    aggiungiRecensioneButton.addEventListener("click", gestisciAccesso);
}
