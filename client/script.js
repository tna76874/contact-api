// Funktion zum Laden der Formulare
async function loadForms() {
    try {
        const response = await fetch(`${hostname}/api/get_forms`, {
            method: 'GET',
            headers: {
                'Authorization': `${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Fehler beim Laden der Daten');
        }

        const forms = await response.json();

        // Sortiere die Formulare nach Datum (neueste zuerst)
        forms.sort((a, b) => new Date(b.date) - new Date(a.date));

        displayForms(forms);
    } catch (error) {
        console.error(error);
    }
}

// Funktion zum Anzeigen der Formulare in der HTML-Seite
function displayForms(forms) {
    const formsList = document.getElementById('formsList');
    const showOpenEntries = document.getElementById('showOpenEntries').checked; // Checkbox-Status abrufen
    formsList.innerHTML = ''; // Vorherige Inhalte löschen

    // Filtere die Formulare basierend auf dem Checkbox-Status
    const filteredForms = showOpenEntries ? forms.filter(form => !form.done) : forms;

    filteredForms.forEach(form => {
        const listItem = document.createElement('li');
        listItem.className = 'form-item'; // CSS-Klasse hinzufügen

        let validationStatus = '';
        if (form.validated === true) {
            validationStatus = 'Email-Verifizierung: erfolgreich';
        } else if (form.validated === false) {
            validationStatus = 'Email-Verifizierung: ausstehend';
        }

        // Status-Button basierend auf form.done
        const statusButtonText = form.done ? "Status auf 'Nicht erledigt' setzen" : "Status auf 'Erledigt' setzen";
        const newStatus = !form.done; // Umgekehrter Status

        listItem.innerHTML = `
            <h3>Vorgangsnummer: ${form.fid}</h3>
            <p><strong>Datum:</strong> ${new Date(form.date).toLocaleString()}</p>
            <p><strong>Tag:</strong> ${form.tag}</p>
            <p><strong>Source:</strong> ${form.source}</p>
            ${validationStatus ? `<p><strong>${validationStatus}</strong></p>` : ''}
            <div class="data">
                <strong>Daten:</strong>
                <div class="form-data">
                    ${Object.entries(form.data).map(([key, value]) => `
                        <p><strong>${key}:</strong> ${value || 'Nicht angegeben'}</p>
                    `).join('')}
                </div>
            </div>
            <button class="hidden" onclick="updateFormStatus('${form.fid}', ${newStatus})">${statusButtonText}</button>
            ${form.delete ? `<button class="hidden" onclick="deleteForm('${form.fid}')">Formular löschen</button>` : ''}
            <button class="hidden" onclick="printForm('${form.fid}')">Druckansicht</button>
        `;

        formsList.appendChild(listItem);
    });
}


async function updateFormStatus(fid, done) {
    try {
        const response = await fetch(`${hostname}/api/update_form_status`, {
            method: 'PUT',
            headers: {
                'Authorization': `${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fid, done })
        });

        if (!response.ok) {
            throw new Error('Fehler beim Aktualisieren des Formularstatus');
        }

        const result = await response.json();
        console.log(result.message);
        loadForms();
    } catch (error) {
        console.error(error);
    }
}

async function deleteForm(fid) {
    try {
        const response = await fetch(`${hostname}/api/delete_form`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fid })
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Formulars');
        }

        const result = await response.json();
        console.log(result.message);
        loadForms();
    } catch (error) {
        console.error(error);
    }
}

// Funktion zum Drucken eines spezifischen Formulars
function printForm(fid) {
    // Finde das spezifische Formular-Element anhand der fid
    const formToPrint = Array.from(document.querySelectorAll('.form-item')).find(item => {
        return item.querySelector('h3').textContent.includes(fid);
    });

    if (!formToPrint) {
        console.error('Formular nicht gefunden');
        return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
        <html>
            <head>
                <title>${fid}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h3 { margin: 0; }
                    p { margin: 5px 0; }
                    .hidden { display: none; }
                </style>
            </head>
            <body>
                ${formToPrint.innerHTML}
                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    }
                </script>
            </body>
        </html>
    `);
}

document.getElementById('showOpenEntries').addEventListener('change', loadForms);

// Formulare laden, wenn die Seite geladen wird
window.onload = loadForms;