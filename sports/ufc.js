export async function getEvents() {
    const url = 'https://www.tapology.com/fightcenter?group=ufc'; // Replace with the actual URL

    try {
        // Fetch the HTML of the page
        const response = await fetch(url);
        const htmlText = await response.text();
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Select <a> elements with the specified class and corresponding <span> for date and time
        const eventElements = doc.querySelectorAll('a.border-b.border-tap_3.border-dotted.hover\\:border-solid');
        const dateElements = doc.querySelectorAll('span.hidden.md\\:inline');
        
        // Define a list of valid day names
        const validDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // Extract and filter date and time information
        const filteredDateTimes = Array.from(dateElements)
            .map(span => span.innerText.trim())
            .filter(dateTime => validDayNames.some(dayName => dateTime.startsWith(dayName)));

        // Extract event names
        const eventNames = Array.from(eventElements).map(el => el.innerText.trim());

        // Pair filtered dates with events
        const events = eventNames.slice(0, filteredDateTimes.length).map((name, index) => {
            return {
                name,
                dateTime: filteredDateTimes[index] || 'Date/Time not available'
            };
        });

        // Filter events to include only those that start with "UFC " and have valid date/time
        const filteredEvents = events.filter(event => event.name.startsWith('UFC ') && event.dateTime !== 'Date/Time not available');

        return filteredEvents;

    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return [];
    }
}
