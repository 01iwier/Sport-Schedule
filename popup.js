import { getEvents } from './sports/ufc.js'; // Adjust the path if needed

document.addEventListener('DOMContentLoaded', async function () {
    const scheduleDiv = document.getElementById('schedule');

    // Load events from the scraper function
    const events = await getEvents();

    // Display events
    if (events.length === 0) {
        scheduleDiv.innerHTML = 'No UFC events found.';
    } else {
        // Create a list of events with date, time, and main event headliner
        scheduleDiv.innerHTML = events.map(event => `
            <div class="event">
                <p><strong>${event.name}</strong></p>
                <p>${event.dateTime}</p>
                <p>${event.mainEvent}</p>
            </div>
        `).join('');
    }
});
