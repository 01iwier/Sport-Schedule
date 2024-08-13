export async function getEvents() {
    const url = 'https://www.tapology.com/fightcenter?group=ufc'; // Replace with the actual URL

    try {
        // Fetch the HTML of the page
        const response = await fetch(url);
        const htmlText = await response.text();
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Select <a> elements for event names and main event headliners
        const eventElements = doc.querySelectorAll('a.border-b.border-tap_3.border-dotted.hover\\:border-solid');
        const dateElements = doc.querySelectorAll('span.hidden.md\\:inline');
        const mainEventElements = doc.querySelectorAll('a.border-b.border-tap_gold.border-dotted.hover\\:border-solid.hover\\:text-tap_darkgold');

        // Define a list of valid day names
        const validDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // Convert dateTime to UK time
        function convertToUKTime(dateTimeStr) {
            // Example input: "Saturday, August 17,  6:30 PM ET"
            const [dayName, month, day, time, period, tz] = dateTimeStr.split(' ');

            // Create a date string in a format we can parse
            const dateTimeString = `${month} ${day}, 2024 ${time} ${period}`; // Assuming current year

            // Parse the date string to create a Date object
            let date = new Date(dateTimeString);

            // Convert to UK time
            // ET (Eastern Time) is typically UTC-5 or UTC-4 during daylight saving
            // UK time is typically UTC+0 or UTC+1 during daylight saving
            // Calculate the difference (ET to UK is +5 hours or +4 hours during daylight saving)
            const offsetDifference = 5; // ET to UK difference in hours

            // Adjust the time
            date.setHours(date.getHours() + offsetDifference);

            // Manually format the date to "Saturday 17 August 11:30"
            const options = { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit', hour12: true };
            const dateFormatter = new Intl.DateTimeFormat('en-GB', options);
            
            // Get formatted parts
            const parts = dateFormatter.formatToParts(date);
            const dayOfWeek = parts.find(part => part.type === 'weekday').value;
            const dayOfMonth = parts.find(part => part.type === 'day').value;
            const monthName = parts.find(part => part.type === 'month').value;
            const timeStr = parts.find(part => part.type === 'hour').value + ':' + parts.find(part => part.type === 'minute').value;

            // Combine parts into desired format
            return `${dayOfWeek} ${dayOfMonth} ${monthName} ${timeStr}`;
        }

        // Extract and filter date and time information
        const filteredDateTimes = Array.from(dateElements)
            .map(span => span.innerText.trim())
            .filter(dateTime => validDayNames.some(dayName => dateTime.startsWith(dayName)))
            .map(dateTime => convertToUKTime(dateTime)); // Convert to UK time

        // Extract event names
        const eventNames = Array.from(eventElements).map(el => el.innerText.trim());

        // Extract and filter main event details
        const mainEventHeadliners = Array.from(mainEventElements)
            .map(el => el.innerText.trim())
            .filter(text => text.includes('vs.'));

        // Pair filtered dates with events and main event headliners
        const events = eventNames.slice(0, filteredDateTimes.length).map((name, index) => {
            return {
                name,
                dateTime: filteredDateTimes[index] || 'Date/Time not available',
                mainEvent: mainEventHeadliners[index] || 'Main event not available'
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
