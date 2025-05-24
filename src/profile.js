// Funzione per il logout dell'utente
function logout() {
    localStorage.setItem("utenteLoggato", JSON.stringify(null));
    console.log("Logout effettuato");

    window.location.href = "index.html";
    alert("Logout effettuato");
}

// Funzione per cancellare il profilo
function cancellaProfilo() {
    let utenteLoggato = JSON.parse(localStorage.getItem("utenteLoggato"));
    let utenti = JSON.parse(localStorage.getItem("utenti")) || [];

    // Filtra la lista rimuovendo l'utente loggato
    let utentiAggiornati = utenti.filter(utente => utente.email !== utenteLoggato.email);
    localStorage.setItem("utenti", JSON.stringify(utentiAggiornati));

    // Rimuove le ricette salvate dall'utente
    let ricetteSalvate = JSON.parse(localStorage.getItem("ricetteSalvate")) || {};
    delete ricetteSalvate[utenteLoggato.email];
    localStorage.setItem("ricetteSalvate", JSON.stringify(ricetteSalvate));

    // Rimuove le recensioni dell'utente
    let recensioniRicette = JSON.parse(localStorage.getItem("recensioniRicette")) || {};
    for (let idRicetta in recensioniRicette) {
        recensioniRicette[idRicetta] = recensioniRicette[idRicetta].filter(
            recensione => recensione.email !== utenteLoggato.email
        );

        if (recensioniRicette[idRicetta].length === 0) {
            delete recensioniRicette[idRicetta];
        }
    }
    localStorage.setItem("recensioniRicette", JSON.stringify(recensioniRicette));

    // Reset dell'utente loggato
    localStorage.setItem("utenteLoggato", JSON.stringify(null));
    console.log("Profilo e dati associati cancellati con successo.");

    window.location.href = "index.html";
}

// Funzione per la modifica del profilo
function confermaModifiche(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cognome = document.getElementById("cognome").value;
    const email = document.getElementById("email").value;
    const vecchiaPassword = document.getElementById("oldPassword").value;
    const nuovaPassword = document.getElementById("newPassword").value;

    const utenteLoggato = JSON.parse(localStorage.getItem("utenteLoggato"));
    const utenti = JSON.parse(localStorage.getItem("utenti")) || [];

    let validazione = true;
    let errorMsg = '';

    if (nome.trim() === "" || cognome.trim() === "") {
        validazione = false;
        errorMsg = "Nome e cognome non possono essere vuoti.";
    }

    if (!email.includes("@")) {
        validazione = false;
        errorMsg = "Email non valida.";
    }

    // Verifica che la nuova email non sia già usata da altri utenti
    for (const utente of utenti) {
        if (utente.email !== utenteLoggato.email && utente.email === email) {
            validazione = false;
            errorMsg = "Questa email è già in uso.";
            break;
        }
    }

    if (vecchiaPassword !== utenteLoggato.password) {
        validazione = false;
        errorMsg = "La vecchia password non è corretta.";
    }

    if (nuovaPassword.length < 8) {
        validazione = false;
        errorMsg = "La nuova password deve essere lunga almeno 8 caratteri.";
    }

    if (validazione) {
        const vecchiaEmail = utenteLoggato.email;
        const index = utenti.findIndex(utente => utente.email === vecchiaEmail);

        utenteLoggato.nome = nome;
        utenteLoggato.cognome = cognome;
        utenteLoggato.email = email;
        utenteLoggato.password = nuovaPassword;
        localStorage.setItem('utenteLoggato', JSON.stringify(utenteLoggato));

        if (index !== -1) {
            utenti[index] = utenteLoggato;
            localStorage.setItem('utenti', JSON.stringify(utenti));
        }

        // Aggiorna email in ricette salvate
        let ricetteSalvate = JSON.parse(localStorage.getItem("ricetteSalvate")) || {};
        if (ricetteSalvate[vecchiaEmail]) {
            ricetteSalvate[email] = ricetteSalvate[vecchiaEmail];
            delete ricetteSalvate[vecchiaEmail];
            localStorage.setItem("ricetteSalvate", JSON.stringify(ricetteSalvate));
        }

        // Aggiorna email nelle recensioni
        let recensioniRicette = JSON.parse(localStorage.getItem("recensioniRicette")) || {};
        for (let idRicetta in recensioniRicette) {
            recensioniRicette[idRicetta].forEach(recensione => {
                if (recensione.email === vecchiaEmail) {
                    recensione.email = email;
                }
            });
        }
        localStorage.setItem("recensioniRicette", JSON.stringify(recensioniRicette));

        console.log("Modifiche accettate e email aggiornata nelle recensioni e ricette salvate.");
        window.location.href = "profile.html";
    } else {
        alert(errorMsg);
    }
}

// Aggiunge gli event listener ai pulsanti (se presenti nella pagina)
let btnDelete = document.getElementById("confirmDelete");
let btnLogout = document.getElementById("logout");
let btnEdit = document.getElementById("edit");

if (btnDelete) {
    btnDelete.addEventListener("click", cancellaProfilo);
}
if (btnLogout) {
    btnLogout.addEventListener("click", logout);
}
if (btnEdit) {
    btnEdit.addEventListener("click", confermaModifiche);
}
