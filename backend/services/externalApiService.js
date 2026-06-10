const TICKETMASTER_API_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = process.env.TICKETMASTER_API_KEY || '7elxdku9GGG5k8j0Xm8KWmANDgecHMV0';

/**
 * Fetches events from Ticketmaster Discovery API
 * @param {Object} params - Search parameters
 * @returns {Promise<Array>} - List of mapped event objects
 */
const fetchExternalEvents = async (params = {}) => {
  try {
    const { search, category, location, date, page = 1, limit = 12 } = params;

    const queryParams = new URLSearchParams({
      apikey: API_KEY,
      size: limit,
      page: Math.max(0, parseInt(page) - 1), // Ticketmaster uses 0-based indexing
      sort: 'date,asc',
      // countryCode: 'IN' // Default to India removed for wider results during testing
    });

    if (search) queryParams.append('keyword', search);
    if (location) queryParams.append('city', location);
    
    // Mapping our categories to Ticketmaster classificationName
    if (category) {
      queryParams.append('classificationName', category);
    }

    if (date) {
      const startDateTime = new Date(date).toISOString().split('.')[0] + 'Z';
      queryParams.append('startDateTime', startDateTime);
    }

    const url = `${TICKETMASTER_API_URL}/events.json?${queryParams}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data._embedded || !data._embedded.events) {
      return [];
    }

    return data._embedded.events.map(event => mapTicketmasterToInternal(event));
  } catch (error) {
    console.error('Error fetching Ticketmaster events:', error);
    return [];
  }
};

/**
 * Fetches a single event from Ticketmaster by ID
 * @param {string} id - Ticketmaster event ID
 * @returns {Promise<Object|null>} - Mapped event object
 */
const fetchExternalEventById = async (id) => {
  try {
    const response = await fetch(`${TICKETMASTER_API_URL}/events/${id}.json?apikey=${API_KEY}`);
    if (!response.ok) return null;
    
    const event = await response.json();
    return mapTicketmasterToInternal(event);
  } catch (error) {
    console.error('Error fetching Ticketmaster event by ID:', error);
    return null;
  }
};

/**
 * Maps Ticketmaster event object to our internal schema
 * @param {Object} tmEvent - Ticketmaster event object
 * @returns {Object} - Internal event object
 */
const mapTicketmasterToInternal = (tmEvent) => {
  const venue = tmEvent._embedded?.venues?.[0];
  const location = venue 
    ? `${venue.name}, ${venue.city?.name}, ${venue.state?.name || venue.country?.name}`
    : 'Online / TBD';

  return {
    id: tmEvent.id, // String ID
    title: tmEvent.name,
    description: tmEvent.info || tmEvent.description || 'No description available for this external event.',
    date: tmEvent.dates?.start?.dateTime || tmEvent.dates?.start?.localDate,
    location: location,
    price: tmEvent.priceRanges?.[0]?.min || 499, // Fallback price
    total_seats: 1000, // External events usually have many seats
    booked_seats: 0,
    remaining_seats: 1000,
    image_url: tmEvent.images?.find(img => img.ratio === '16_9' || img.ratio === '4_3')?.url || tmEvent.images?.[0]?.url,
    category: tmEvent.classifications?.[0]?.segment?.name || 'Other',
    source: 'Ticketmaster',
    source_url: tmEvent.url,
    organizer_id: null, // External event
    sessions: [],
    bookings: []
  };
};

module.exports = {
  fetchExternalEvents,
  fetchExternalEventById
};
