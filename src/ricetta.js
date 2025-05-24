function dettagliRicetta() {
    // Ottieni l'ID della ricetta dalla URL
    var parametri = new URLSearchParams(window.location.search);
    var idRicetta = parametri.get("id_ricetta");

    let ricette = JSON.parse(localStorage.getItem('ricette'));

    if (ricette) {
        // Trova la ricetta corrispondente all'ID
        let ricetta = ricette.find(r => r.idMeal === idRicetta);

        if (ricetta) {
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
        } else {
            console.log("Ricetta non trovata");
        }
    } else {
        console.log("Nessuna ricetta disponibile nel localStorage");
    }

    // Mostra le recensioni
    mostraRecensioni(idRicetta);
}

// Funzione per mostrare le recensioni
function mostraRecensioni(idRicetta) {
    let listaRecensioni = document.getElementById("lista-recensioni");
    let master = document.getElementById("card-master");

    listaRecensioni.innerHTML = "";
    listaRecensioni.appendChild(master);

    let recensioni = JSON.parse(localStorage.getItem("recensioniRicette")) || {};
    let recensioniRicetta = recensioni[idRicetta] || [];

    recensioniRicetta.forEach((recensione) => {
        let clone = master.cloneNode(true);
        clone.classList.remove('d-none');

        clone.getElementsByClassName('card-email')[0].innerText = recensione.email;
        clone.getElementsByClassName('card-data')[0].innerText = "Data di preparazione: " + recensione.data;
        clone.getElementsByClassName('card-difficolta')[0].innerText = "Difficoltà: " + recensione.difficolta;
        clone.getElementsByClassName('card-gusto')[0].innerText = "Gusto: " + recensione.gusto;

        listaRecensioni.appendChild(clone);
    });
}

dettagliRicetta();
