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
    formsList.innerHTML = ''; // Vorherige Inhalte löschen

    forms.forEach(form => {
        const listItem = document.createElement('li');
        listItem.className = 'form-item'; // CSS-Klasse hinzufügen

        // Überprüfe das 'validated'-Feld und setze den entsprechenden Text
        let validationStatus = '';
        if (form.validated === true) {
            validationStatus = 'Email-Verifizierung: erfolgreich';
        } else if (form.validated === false) {
            validationStatus = 'Email-Verifizierung: ausstehend';
        }

        // Inhalt des Listenelements erstellen
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
        `;

        formsList.appendChild(listItem);
    });
}


// Formulare laden, wenn die Seite geladen wird
window.onload = loadForms;