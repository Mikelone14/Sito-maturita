document.addEventListener('DOMContentLoaded', function() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            /* Alterna tra l'aggiungere e il rimuovere la classe "active",
            per evidenziare il bottone che controlla il pannello */
            this.classList.toggle("active");

            /* Ottieni il pannello (contenuto) successivo al bottone cliccato */
            var panel = this.nextElementSibling;

            /* Alterna la visualizzazione del pannello */
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null; // Se è aperto, chiudilo
            } else {
                // Imposta l'altezza massima per mostrarlo. `scrollHeight` è l'altezza effettiva del contenuto.
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
});