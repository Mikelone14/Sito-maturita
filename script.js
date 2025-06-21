// Codice per l'accordion principale
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      // *** MODIFICA QUI: Imposta un max-height molto grande per il pannello genitore ***
      panel.style.maxHeight = "9999px"; // Un valore grande che dovrebbe sempre essere sufficiente
      // Rimuoviamo la linea precedente: panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

// Codice per l'accordion interno (lasciato invariato, funziona già correttamente)
var innerAcc = document.getElementsByClassName("inner-accordion");
var j;

for (j = 0; j < innerAcc.length; j++) {
  innerAcc[j].addEventListener("click", function() {
    this.classList.toggle("active");
    var innerPanel = this.nextElementSibling;
    var parentPanel = this.closest('.panel'); // Riferimento al pannello genitore

    console.log("--- Click su 'Mostra Componenti' ---");
    console.log("Stato iniziale innerPanel.style.maxHeight:", innerPanel.style.maxHeight);

    // Gestione apertura/chiusura pannello interno
    if (innerPanel.style.maxHeight && innerPanel.style.maxHeight !== "0px") {
      // Si sta chiudendo
      innerPanel.style.maxHeight = null;
      console.log("Pannello interno: Chiuso (maxHeight = null)");
    } else {
      // Si sta aprendo
      setTimeout(() => {
        innerPanel.style.maxHeight = innerPanel.scrollHeight + "px";
        console.log("Pannello interno: Aperto (maxHeight = " + innerPanel.scrollHeight + "px)");
      }, 0);
    }

    // Nota: La logica di ricalcolo del parentPanel qui sotto diventa meno critica
    // dato che il parentPanel.style.maxHeight sarà sempre "9999px" quando è aperto.
    // Puoi anche rimuovere queste linee se vuoi, ma non fanno male.
    if (parentPanel && parentPanel.style.maxHeight && parentPanel.style.maxHeight !== "0px") {
        console.log("Pannello genitore rilevato e aperto (non ricalcolo esplicito, è già grande).");
        // Non è necessario un ricalcolo qui, dato che il max-height è fisso e grande.
        // Puoi commentare o rimuovere le seguenti 3 linee se preferisci una console più pulita
        // parentPanel.style.maxHeight = 'none';
        // parentPanel.offsetHeight;
        // parentPanel.style.maxHeight = parentPanel.scrollHeight + 'px';
    }
    console.log("---------------------------------");
  });
}