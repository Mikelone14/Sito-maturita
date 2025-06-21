document.addEventListener("DOMContentLoaded", function() {

    // --- Funzione Helper per animazioni fluide (senza jQuery) ---
    // Questa funzione gestisce l'apertura/chiusura fluida di un pannello
    // `element`: il pannello da animare (es. .panel o .inner-panel)
    // `state`: 'open' o 'close'
    // `duration`: durata dell'animazione in millisecondi
    function slideToggleNative(element, state, duration = 500) {
        // Imposta la durata della transizione CSS
        element.style.transition = `max-height ${duration / 1000}s ease-out, padding ${duration / 1000}s ease-out`;

        if (state === 'open') {
            // Se il pannello è già aperto o in fase di apertura, non fare nulla
            if (element.style.maxHeight && element.style.maxHeight !== '0px') {
                return;
            }

            // Temporaneamente rimuovi maxHeight e padding per calcolare l'altezza reale
            // Senza questo, scrollHeight potrebbe non essere corretto
            const originalPaddingTop = getComputedStyle(element).paddingTop;
            const originalPaddingBottom = getComputedStyle(element).paddingBottom;
            element.style.paddingTop = '18px'; // Reimposta padding per calcolo corretto
            element.style.paddingBottom = '18px'; // Reimposta padding per calcolo corretto
            element.style.maxHeight = 'none';

            // Forza il browser a ricalcolare lo stile (reflow)
            const height = element.scrollHeight;

            // Ripristina padding e inizia la transizione da 0
            element.style.paddingTop = '0';
            element.style.paddingBottom = '0';
            element.style.maxHeight = '0px';
            element.style.overflow = 'hidden'; // Assicurati che overflow sia hidden

            // Usa requestAnimationFrame per applicare la transizione nel prossimo frame
            requestAnimationFrame(() => {
                element.style.maxHeight = height + 'px';
                element.style.paddingTop = originalPaddingTop;
                element.style.paddingBottom = originalPaddingBottom;
            });

            // Rimuovi la transizione dopo che è finita per evitare problemi futuri
            element.addEventListener('transitionend', function handler() {
                // Dopo l'apertura completa, resetta maxHeight a 'none' per permettere al contenuto dinamico
                // di espandersi senza restrizioni e rimuovi la transizione CSS temporanea.
                if (element.style.maxHeight !== '0px') {
                     element.style.maxHeight = 'none';
                }
                element.style.transition = '';
                element.removeEventListener('transitionend', handler);
            }, { once: true }); // 'once: true' assicura che l'evento si attivi solo una volta

        } else if (state === 'close') {
            // Se il pannello è già chiuso o in fase di chiusura, non fare nulla
            if (!element.style.maxHeight || element.style.maxHeight === '0px') {
                return;
            }

            // Imposta l'altezza corrente prima di iniziare a chiudere
            element.style.maxHeight = element.scrollHeight + 'px';
            element.style.paddingTop = getComputedStyle(element).paddingTop;
            element.style.paddingBottom = getComputedStyle(element).paddingBottom;


            requestAnimationFrame(() => {
                element.style.maxHeight = '0px';
                element.style.paddingTop = '0';
                element.style.paddingBottom = '0';
            });
            // Rimuovi la transizione dopo che è finita
            element.addEventListener('transitionend', function handler() {
                element.style.transition = ''; // Rimuove la transizione
                element.style.overflow = 'hidden'; // Assicurati che rimanga nascosto
                element.removeEventListener('transitionend', handler);
            }, { once: true });
        }
    }
    // --- Fine Funzione Helper ---


    // Gestione degli accordion principali (.accordion)
    var accordions = document.getElementsByClassName("accordion");

    for (var i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling; // Il pannello è l'elemento successivo al bottone

            if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
                // Se il pannello è aperto, chiudilo
                slideToggleNative(panel, 'close', 300); // Durata per il principale (es. 300ms)
            } else {
                // Se il pannello è chiuso, aprilo
                slideToggleNative(panel, 'open', 300); // Durata per il principale (es. 300ms)

                // Chiudi eventuali inner-panel aperti all'interno di questo panel principale
                // quando si apre, per evitare confusione
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
                // Se il pannello interno è aperto, chiudilo
                slideToggleNative(innerPanel, 'close', 200); // Durata per l'interno (es. 200ms)
            } else {
                // Se il pannello interno è chiuso, aprilo
                slideToggleNative(innerPanel, 'open', 200); // Durata per l'interno (es. 200ms)
            }

            // --- AGGIORNAMENTO FONDAMENTALE PER IL PANNELLO GENITORE ---
            // Quando un pannello interno si apre/chiude, il suo pannello genitore (principale)
            // deve adattare la sua altezza per contenere il nuovo contenuto.
            var parentPanel = this.closest('.panel');
            if (parentPanel && parentPanel.style.maxHeight && parentPanel.style.maxHeight !== "0px") {
                // Applica un piccolo ritardo con requestAnimationFrame per assicurarsi
                // che l'innerPanel abbia finito di ricalcolare la sua altezza prima di ricalcolare il genitore.
                requestAnimationFrame(() => {
                    // Temporaneamente rimuovi maxHeight e padding per calcolare l'altezza reale
                    parentPanel.style.maxHeight = 'none';
                    parentPanel.style.paddingTop = getComputedStyle(parentPanel).paddingTop;
                    parentPanel.style.paddingBottom = getComputedStyle(parentPanel).paddingBottom;

                    // Forza il reflow per ottenere la nuova scrollHeight
                    const newParentHeight = parentPanel.scrollHeight;
                    parentPanel.style.maxHeight = newParentHeight + 'px'; // Imposta la nuova altezza

                    // Una volta animato, rimuovi la transition temporanea e ripristina maxHeight: 'none'
                    parentPanel.addEventListener('transitionend', function handler() {
                        if (parentPanel.style.maxHeight !== '0px') {
                            parentPanel.style.maxHeight = 'none'; // Permette al genitore di adattarsi se il contenuto cambia ulteriormente
                        }
                        parentPanel.style.transition = '';
                        parentPanel.removeEventListener('transitionend', handler);
                    }, { once: true });
                });
            }
        });
    }
});