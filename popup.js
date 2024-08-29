import { getEvents } from './sports/ufc.js';

document.addEventListener('DOMContentLoaded', async function () {
    const scheduleDiv = document.getElementById('schedule');

    const events = await getEvents();

    if (events.length === 0) {
        scheduleDiv.innerHTML = 'No UFC events found.';
    } else {
        scheduleDiv.innerHTML = events.map(event => `
            <div class="event">
                <p><strong>${event.name}</strong></p>
                <p>${event.dateTime}</p>
                <p>${event.mainEvent}</p>
            </div>
        `).join('');
    }
});
