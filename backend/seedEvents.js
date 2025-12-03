require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper function to generate random dates in the future
function getRandomFutureDate(daysFromNow = 7, maxDays = 120) {
  const days = Math.floor(Math.random() * maxDays) + daysFromNow;
  const date = new Date();
  date.setDate(date.getDate() + days);
  const hours = Math.floor(Math.random() * 12) + 9; // Between 9 AM and 9 PM
  const minutes = Math.random() < 0.5 ? 0 : 30;
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Helper function to get random image from Unsplash
function getRandomImage(category) {
  const images = {
    music: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'
    ],
    tech: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80'
    ],
    food: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      'https://images.unsplash.com/photo-1504113888839-1c8eb50233d3?w=800&q=80'
    ],
    art: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
      'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0fccf1?w=800&q=80',
      'https://images.unsplash.com/photo-1511389026070-a14ae610a1be?w=800&q=80'
    ],
    sports: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80'
    ],
    wellness: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    ],
    default: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80'
    ]
  };
  const categoryImages = images[category] || images.default;
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
}

// Indian cities with venues
const cities = [
  { city: 'Mumbai', state: 'Maharashtra', venues: ['BKC Grounds', 'NSCI Dome', 'Jio World Garden', 'Worli Sea Face', 'Bandra Kurla Complex', 'Andheri Sports Complex'] },
  { city: 'Delhi', state: 'Delhi', venues: ['India Gate', 'Jawaharlal Nehru Stadium', 'DLF Cyber Hub', 'Connaught Place', 'Aerocity', 'Lodhi Gardens'] },
  { city: 'Bangalore', state: 'Karnataka', venues: ['Palace Grounds', 'UB City', 'Koramangala', 'Whitefield', 'Indiranagar', 'Cubbon Park'] },
  { city: 'Pune', state: 'Maharashtra', venues: ['Laxmi Lawns', 'JW Marriott', 'Koregaon Park', 'Hinjewadi', 'Baner', 'Viman Nagar'] },
  { city: 'Hyderabad', state: 'Telangana', venues: ['HITEC City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 'Secunderabad', 'Hitex Exhibition Centre'] },
  { city: 'Chennai', state: 'Tamil Nadu', venues: ['Marina Beach', 'SPI Cinemas', 'Phoenix Mall', 'IT Corridor', 'T Nagar', 'Besant Nagar'] },
  { city: 'Kolkata', state: 'West Bengal', venues: ['Salt Lake', 'Park Street', 'New Town', 'Howrah', 'Ballygunge', 'Victoria Memorial'] },
  { city: 'Jaipur', state: 'Rajasthan', venues: ['Pink City', 'Amber Fort', 'City Palace', 'Jawahar Circle', 'Vaishali Nagar', 'Rajasthan University'] },
  { city: 'Goa', state: 'Goa', venues: ['Vagator Beach', 'Baga Beach', 'Calangute', 'Anjuna', 'Panjim', 'Candolim'] },
  { city: 'Kochi', state: 'Kerala', venues: ['Marine Drive', 'Fort Kochi', 'Lulu Mall', 'Kakkanad', 'Edappally', 'Jawaharlal Nehru Stadium'] }
];

// Event templates with realistic data
const eventTemplates = [
  // Music Events
  { category: 'music', titles: ['Music Festival', 'Concert', 'Live Performance', 'Rock Show', 'EDM Night', 'Jazz Evening', 'Folk Music Festival', 'Indie Music Night'], 
    descriptions: ['Experience electrifying performances', 'Join us for an unforgettable musical journey', 'Get ready to dance the night away', 'Celebrate music and culture'] },
  // Tech Events
  { category: 'tech', titles: ['Tech Summit', 'Developer Conference', 'AI/ML Workshop', 'Startup Pitch', 'Hackathon', 'Cloud Computing Meetup', 'Cybersecurity Seminar', 'Blockchain Workshop'],
    descriptions: ['Learn from industry experts', 'Network with tech professionals', 'Discover the latest innovations', 'Build your tech career'] },
  // Food Events
  { category: 'food', titles: ['Food Festival', 'Culinary Workshop', 'Wine Tasting', 'Street Food Tour', 'Chef Masterclass', 'Food & Wine Pairing', 'Regional Cuisine Festival', 'Dessert Festival'],
    descriptions: ['Savor authentic flavors', 'Learn from master chefs', 'Explore culinary traditions', 'Indulge in gastronomic delights'] },
  // Art Events
  { category: 'art', titles: ['Art Exhibition', 'Gallery Opening', 'Photography Workshop', 'Art Fair', 'Sculpture Display', 'Digital Art Show', 'Contemporary Art Festival', 'Street Art Tour'],
    descriptions: ['Discover emerging artists', 'Explore contemporary art', 'Immerse in creative expressions', 'Celebrate artistic diversity'] },
  // Sports Events
  { category: 'sports', titles: ['Marathon', 'Cricket Match', 'Football Tournament', 'Yoga Session', 'Fitness Bootcamp', 'Cycling Event', 'Swimming Competition', 'Badminton Tournament'],
    descriptions: ['Stay active and healthy', 'Compete with fellow enthusiasts', 'Achieve your fitness goals', 'Experience the thrill of sports'] },
  // Wellness Events
  { category: 'wellness', titles: ['Yoga Retreat', 'Meditation Workshop', 'Wellness Seminar', 'Spa Day', 'Ayurveda Session', 'Mindfulness Workshop', 'Health & Wellness Expo', 'Detox Program'],
    descriptions: ['Rejuvenate your mind and body', 'Find inner peace', 'Prioritize your wellbeing', 'Transform your lifestyle'] }
];

function generateEvent() {
  const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
  const cityData = cities[Math.floor(Math.random() * cities.length)];
  const venue = cityData.venues[Math.floor(Math.random() * cityData.venues.length)];
  const titlePrefix = template.titles[Math.floor(Math.random() * template.titles.length)];
  const descriptionBase = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
  
  const eventTypes = {
    music: {
      prefixes: ['NH7', 'Sunburn', 'Vh1', 'MTV', 'Zee', 'Colors'],
      suffixes: ['Weekender', 'Festival', 'Concert', 'Night', 'Live'],
      prices: [1500, 2500, 3500, 4500, 5500],
      seats: [500, 1000, 2000, 5000, 10000, 15000]
    },
    tech: {
      prefixes: ['TechSparks', 'DevCon', 'AI Summit', 'Cloud', 'Startup'],
      suffixes: ['2024', 'Conference', 'Summit', 'Meetup', 'Workshop'],
      prices: [2000, 3500, 4999, 7500, 10000],
      seats: [200, 500, 1000, 2000, 5000, 8000]
    },
    food: {
      prefixes: ['Food', 'Culinary', 'Gourmet', 'Street Food', 'Wine'],
      suffixes: ['Festival', 'Workshop', 'Tasting', 'Tour', 'Masterclass'],
      prices: [800, 1500, 2800, 4500, 6000],
      seats: [50, 100, 200, 500, 1000]
    },
    art: {
      prefixes: ['Art', 'Gallery', 'Contemporary', 'Modern', 'Digital'],
      suffixes: ['Fair', 'Exhibition', 'Show', 'Festival', 'Display'],
      prices: [500, 1200, 1800, 2500, 3500],
      seats: [100, 300, 500, 1000, 3000, 5000]
    },
    sports: {
      prefixes: ['Marathon', 'Fitness', 'Yoga', 'Sports', 'Athletic'],
      suffixes: ['2024', 'Challenge', 'Session', 'Tournament', 'Event'],
      prices: [500, 1000, 2000, 3500, 5000],
      seats: [100, 500, 1000, 2000, 5000]
    },
    wellness: {
      prefixes: ['Wellness', 'Yoga', 'Meditation', 'Ayurveda', 'Spa'],
      suffixes: ['Retreat', 'Workshop', 'Session', 'Program', 'Experience'],
      prices: [1500, 3000, 5000, 10000, 25000],
      seats: [20, 30, 50, 100, 200]
    }
  };

  const typeData = eventTypes[template.category];
  const prefix = typeData.prefixes[Math.floor(Math.random() * typeData.prefixes.length)];
  const suffix = typeData.suffixes[Math.floor(Math.random() * typeData.suffixes.length)];
  const title = `${prefix} ${suffix} - ${cityData.city}`;
  
  const price = typeData.prices[Math.floor(Math.random() * typeData.prices.length)];
  const seats = typeData.seats[Math.floor(Math.random() * typeData.seats.length)];
  
  const descriptions = {
    music: `${descriptionBase} at ${cityData.city}'s premier music venue. Featuring top artists, multiple stages, food stalls, and an electrifying atmosphere. Don't miss this incredible musical experience!`,
    tech: `${descriptionBase} in ${cityData.city}. Join industry leaders, participate in workshops, network with professionals, and stay ahead of the curve in technology.`,
    food: `${descriptionBase} in ${cityData.city}. Sample authentic cuisines, learn cooking techniques, meet renowned chefs, and indulge in a gastronomic adventure.`,
    art: `${descriptionBase} in ${cityData.city}. Explore diverse artworks, meet talented artists, attend curator talks, and discover your next favorite piece.`,
    sports: `${descriptionBase} in ${cityData.city}. Join fellow enthusiasts, improve your skills, compete in friendly matches, and stay active.`,
    wellness: `${descriptionBase} in ${cityData.city}. Rejuvenate your mind, body, and soul with expert guidance, peaceful surroundings, and transformative experiences.`
  };

  return {
    title,
    description: descriptions[template.category],
    date: getRandomFutureDate(7, 120),
    location: `${venue}, ${cityData.city}, ${cityData.state}`,
    price,
    total_seats: seats,
    image_url: getRandomImage(template.category)
  };
}

async function seedEvents() {
  try {
    console.log('🌱 Seeding realistic events...');

    // Get or create an admin user for organizer_id
    let adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      // Create a default admin user if none exists
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@eventease.com',
          password: hashedPassword,
          name: 'EventEase Admin',
          role: 'admin'
        }
      });
      console.log('👤 Created default admin user (email: admin@eventease.com, password: admin123)');
    }

    // Clear existing events (optional - comment out if you want to keep existing)
    // await prisma.booking.deleteMany();
    // await prisma.session.deleteMany();
    // await prisma.event.deleteMany();
    // console.log('🧹 Cleared existing events');

    // Generate 50 realistic events
    const eventsToCreate = [];
    for (let i = 0; i < 50; i++) {
      const event = generateEvent();
      eventsToCreate.push({
        ...event,
        organizer_id: adminUser.id
      });
    }

    // Create events in batches
    const batchSize = 10;
    let created = 0;
    for (let i = 0; i < eventsToCreate.length; i += batchSize) {
      const batch = eventsToCreate.slice(i, i + batchSize);
      await Promise.all(
        batch.map(event => 
          prisma.event.create({ data: event })
            .then(e => {
              created++;
              console.log(`✅ [${created}/50] Created: ${e.title}`);
            })
        )
      );
    }

    console.log(`\n🎉 Successfully seeded ${created} realistic events!`);
    console.log(`📊 Events assigned to organizer: ${adminUser.name} (${adminUser.email})`);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedEvents();
