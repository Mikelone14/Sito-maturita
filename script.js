document.addEventListener("DOMContentLoaded", function() {

    // --- Funzione Helper per animazioni fluide (senza jQuery) ---
    function slideToggleNative(element, state, duration = 500) {
        // Imposta la durata della transizione CSS
        element.style.transition = `max-height ${duration / 1000}s ease-out, padding ${duration / 1000}s ease-out`;
        element.style.overflow = 'hidden'; // Assicurati sempre che overflow sia hidden per la transizione

        if (state === 'open') {
            if (element.style.maxHeight && element.style.maxHeight !== '0px') {
                return; // Già aperto o in fase di apertura
            }

            // Salva i padding originali per ripristinarli dopo il calcolo
            const originalPaddingTop = getComputedStyle(element).paddingTop;
            const originalPaddingBottom = getComputedStyle(element).paddingBottom;

            // Per ottenere lo scrollHeight corretto, dobbiamo temporaneamente rimuovere maxHeight e impostare padding reali
            element.style.maxHeight = 'none';
            element.style.paddingTop = originalPaddingTop;
            element.style.paddingBottom = originalPaddingBottom;

            // Forza il browser a ricalcolare lo stile (reflow) per ottenere l'altezza corretta
            const height = element.scrollHeight;

            // Inizializza per la transizione da 0
            element.style.maxHeight = '0px';
            element.style.paddingTop = '0px';
            element.style.paddingBottom = '0px';

            requestAnimationFrame(() => {
                // Dopo un frame, imposta l'altezza e il padding finali per l'animazione
                // Aggiungiamo un piccolo setTimeout qui per dare al browser un respiro extra
                // specialmente su GitHub Pages dove i tempi possono variare leggermente.
                setTimeout(() => {
                    element.style.maxHeight = height + 'px';
                    element.style.paddingTop = originalPaddingTop;
                    element.style.paddingBottom = originalPaddingBottom;
                }, 10); // Piccolo ritardo di 10ms
            });

            // Rimuovi la transizione dopo che è finita, e resetta maxHeight a 'none'
            element.addEventListener('transitionend', function handler() {
                if (element.style.maxHeight !== '0px') {
                    element.style.maxHeight = 'none'; // Permette al contenuto dinamico di espandersi
                }
                element.style.transition = '';
                element.removeEventListener('transitionend', handler);
            }, { once: true });

        } else if (state === 'close') {
            if (!element.style.maxHeight || element.style.maxHeight === '0px') {
                return; // Già chiuso o in fase di chiusura
            }

            // Imposta l'altezza e il padding correnti prima di iniziare a chiudere
            element.style.maxHeight = element.scrollHeight + 'px';
            element.style.paddingTop = getComputedStyle(element).paddingTop;
            element.style.paddingBottom = getComputedStyle(element).paddingBottom;

            requestAnimationFrame(() => {
                element.style.maxHeight = '0px';
                element.style.paddingTop = '0px';
                element.style.paddingBottom = '0px';
            });

            element.addEventListener('transitionend', function handler() {
                element.style.transition = '';
                element.removeEventListener('transitionend', handler);
            }, { once: true });
        }
    }

    // Gestione degli accordion principali (.accordion)
    var accordions = document.getElementsByClassName("accordion");

    for (var i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling; // Il pannello è l'elemento successivo al bottone

            if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
                slideToggleNative(panel, 'close', 300); // Durata per il principale (es. 300ms)
            } else {
                slideToggleNative(panel, 'open', 300); // Durata per il principale (es. 300ms)

                // Chiudi eventuali inner-panel aperti all'interno di questo panel principale
                panel.querySelectorAll('.inner-accordion.active').forEach(function(innerAcc) {
                    innerAcc.classList.remove('active');
                    slideToggleNative(innerAcc.nextElementSibling, 'close', 200); // Durata per gli interni (es. 200ms)
                });
            }
        });
    }

    // Gestione degli accordion interni (.inner-accordion)
    var innerAccordions = document.getElementsByClassName("inner-accordion");

    for (var j = 0; j < innerAccordions.length; j++) {
        innerAccordions[j].addEventListener("click", function() {
            this.classList.toggle("active");
            var innerPanel = this.nextElementSibling; // Seleziona il pannello interno associato

            if (innerPanel.style.maxHeight && innerPanel.style.maxHeight !== '0px') {
                slideToggleNative(innerPanel, 'close', 200); // Durata per l'interno (es. 200ms)
            } else {
                slideToggleNative(innerPanel, 'open', 200); // Durata per l'interno (es. 200ms)
            }

            // --- AGGIORNAMENTO FONDAMENTALE PER IL PANNELLO GENITORE ---
            var parentPanel = this.closest('.panel');
            if (parentPanel && parentPanel.style.maxHeight && parentPanel.style.maxHeight !== "0px") {
                // Questa parte è cruciale per adattare l'altezza del pannello genitore
                requestAnimationFrame(() => {
                    // Temporaneamente rimuovi maxHeight e padding del genitore per calcolare l'altezza reale
                    parentPanel.style.maxHeight = 'none';
                    parentPanel.style.paddingTop = getComputedStyle(parentPanel).paddingTop;
                    parentPanel.style.paddingBottom = getComputedStyle(parentPanel).paddingBottom;

                    // Forza il reflow e imposta la nuova altezza
                    const newParentHeight = parentPanel.scrollHeight;
                    parentPanel.style.maxHeight = newParentHeight + 'px';

                    // Una volta animato, rimuovi la transition temporanea e ripristina maxHeight: 'none'
                    parentPanel.addEventListener('transitionend', function handler() {
                        if (parentPanel.style.maxHeight !== '0px') {
                            parentPanel.style.maxHeight = 'none';
                        }
                        parentPanel.style.transition = '';
                        parentPanel.removeEventListener('transitionend', handler);
                    }, { once: true });
                });
            }
        });
    }
});