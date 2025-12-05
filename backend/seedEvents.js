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

// Realistic Indian event templates
const realisticEvents = [
  // Music Events - Indian festivals and concerts
  { category: 'music', title: 'Sunburn Festival', description: 'Asia\'s biggest electronic dance music festival featuring international DJs and artists. Experience the ultimate party with world-class production, multiple stages, and an electrifying atmosphere.', price: 3500, seats: 15000 },
  { category: 'music', title: 'NH7 Weekender', description: 'India\'s happiest music festival featuring indie, rock, and alternative artists. Multiple stages, food stalls, and camping options available.', price: 2500, seats: 8000 },
  { category: 'music', title: 'Coke Studio Live Concert', description: 'Live performances by renowned Indian artists featuring fusion of classical and contemporary music. An unforgettable musical journey.', price: 2000, seats: 5000 },
  { category: 'music', title: 'Bollywood Night - Live Performance', description: 'Experience the magic of Bollywood with live performances of hit songs by popular playback singers and dancers.', price: 1500, seats: 3000 },
  { category: 'music', title: 'Carnatic Music Concert', description: 'Traditional South Indian classical music performance by renowned artists. A soulful evening of ragas and talas.', price: 800, seats: 500 },
  { category: 'music', title: 'Hindustani Classical Evening', description: 'Evening of classical North Indian music featuring tabla, sitar, and vocal performances by maestros.', price: 1000, seats: 800 },
  { category: 'music', title: 'Rock Concert - Indian Bands', description: 'High-energy rock concert featuring top Indian rock bands. Headbang to the best of Indian rock music.', price: 1800, seats: 4000 },
  { category: 'music', title: 'Folk Music Festival', description: 'Celebrate India\'s rich folk music heritage with performances from different states. Traditional instruments and authentic sounds.', price: 1200, seats: 2000 },
  
  // Tech Events - Indian tech conferences
  { category: 'tech', title: 'TechSparks 2024', description: 'India\'s largest startup-tech conference. Network with entrepreneurs, investors, and tech leaders. Keynotes, workshops, and startup showcase.', price: 4999, seats: 5000 },
  { category: 'tech', title: 'DevConf India', description: 'Developer conference featuring talks on latest technologies, hands-on workshops, and networking opportunities with industry experts.', price: 3500, seats: 2000 },
  { category: 'tech', title: 'AI & Machine Learning Summit', description: 'Learn about cutting-edge AI/ML technologies, real-world applications, and network with data scientists and AI researchers.', price: 4500, seats: 1500 },
  { category: 'tech', title: 'Startup Pitch Competition', description: 'Watch innovative startups pitch their ideas to investors. Networking session and mentorship opportunities included.', price: 2000, seats: 800 },
  { category: 'tech', title: 'Hackathon - 48 Hours', description: 'Build innovative solutions in 48 hours. Prizes worth ₹5 lakhs. Free food, swag, and mentorship from industry experts.', price: 500, seats: 500 },
  { category: 'tech', title: 'Cloud Computing Workshop', description: 'Hands-on workshop on AWS, Azure, and GCP. Learn cloud architecture, deployment, and best practices from certified trainers.', price: 3000, seats: 200 },
  { category: 'tech', title: 'Cybersecurity Seminar', description: 'Learn about latest cybersecurity threats, prevention strategies, and ethical hacking. Industry experts and live demonstrations.', price: 2500, seats: 300 },
  { category: 'tech', title: 'Blockchain & Web3 Conference', description: 'Explore blockchain technology, cryptocurrencies, NFTs, and decentralized applications. Network with blockchain developers.', price: 4000, seats: 1000 },
  
  // Food Events - Indian food festivals
  { category: 'food', title: 'Street Food Festival', description: 'Taste authentic street food from across India. Chaat, vada pav, dosa, momos, and more. Live cooking demonstrations included.', price: 500, seats: 2000 },
  { category: 'food', title: 'Regional Cuisine Festival', description: 'Explore diverse Indian cuisines - North, South, East, West. Traditional recipes, cooking workshops, and food stalls.', price: 800, seats: 1000 },
  { category: 'food', title: 'Chef Masterclass - Indian Cooking', description: 'Learn authentic Indian cooking from celebrity chefs. Hands-on workshop with recipes and techniques. Take home ingredients.', price: 3500, seats: 50 },
  { category: 'food', title: 'Wine & Cheese Tasting', description: 'Curated selection of Indian and international wines paired with artisanal cheeses. Expert sommelier guidance included.', price: 2500, seats: 100 },
  { category: 'food', title: 'Dessert Festival', description: 'Indulge in traditional and modern Indian desserts. Gulab jamun, rasgulla, kulfi, and fusion desserts. Unlimited tasting.', price: 1200, seats: 300 },
  { category: 'food', title: 'Vegan Food Festival', description: 'Plant-based Indian cuisine showcase. Delicious vegan versions of traditional dishes. Cooking demos and recipe sharing.', price: 600, seats: 500 },
  { category: 'food', title: 'BBQ & Grill Night', description: 'Live BBQ station with kebabs, tikkas, and grilled vegetables. Unlimited food and soft drinks included.', price: 1800, seats: 200 },
  { category: 'food', title: 'South Indian Food Festival', description: 'Authentic South Indian cuisine - dosas, idlis, sambar, rasam, and traditional thali. Live counter service.', price: 700, seats: 400 },
  
  // Art Events - Indian art exhibitions
  { category: 'art', title: 'Contemporary Art Exhibition', description: 'Showcase of modern Indian art by emerging and established artists. Paintings, sculptures, and installations.', price: 500, seats: 1000 },
  { category: 'art', title: 'Photography Workshop', description: 'Learn photography techniques from professional photographers. Hands-on session with models and props. Certificate included.', price: 2500, seats: 30 },
  { category: 'art', title: 'Art Fair - Indian Artists', description: 'Meet 100+ Indian artists, view their works, and purchase original art. Live painting sessions and art talks.', price: 300, seats: 3000 },
  { category: 'art', title: 'Traditional Art Display', description: 'Exhibition of traditional Indian art forms - Madhubani, Warli, Tanjore paintings, and handicrafts. Artisan demonstrations.', price: 400, seats: 800 },
  { category: 'art', title: 'Sculpture Exhibition', description: 'Contemporary and traditional Indian sculptures by renowned artists. Interactive installations and guided tours.', price: 600, seats: 500 },
  { category: 'art', title: 'Digital Art Show', description: 'Futuristic digital art installations, VR experiences, and interactive displays. Technology meets creativity.', price: 800, seats: 600 },
  { category: 'art', title: 'Street Art Tour', description: 'Guided tour of city\'s best street art and murals. Learn about artists and their stories. Photo opportunities.', price: 500, seats: 50 },
  { category: 'art', title: 'Pottery Workshop', description: 'Hands-on pottery making workshop. Learn wheel throwing and hand-building techniques. Take home your creations.', price: 1500, seats: 20 },
  
  // Sports Events - Indian sports
  { category: 'sports', title: 'Mumbai Marathon', description: 'India\'s largest marathon with full, half, and 10K categories. Run through iconic Mumbai landmarks. T-shirt, medal, and certificate.', price: 1500, seats: 50000 },
  { category: 'sports', title: 'Cricket Match - T20', description: 'Live T20 cricket match between top teams. Premium seating with food and beverages included.', price: 2500, seats: 30000 },
  { category: 'sports', title: 'Football Tournament', description: 'Inter-city football tournament. Watch exciting matches and support your favorite team. Food stalls available.', price: 500, seats: 5000 },
  { category: 'sports', title: 'Yoga Session - Morning', description: 'Early morning yoga session in nature. Hatha and Vinyasa flow. All levels welcome. Mats provided.', price: 300, seats: 100 },
  { category: 'sports', title: 'Fitness Bootcamp', description: 'Intensive fitness bootcamp with professional trainers. Cardio, strength training, and nutrition guidance. 3-day program.', price: 2000, seats: 50 },
  { category: 'sports', title: 'Cycling Event - City Tour', description: 'Guided cycling tour of the city. Safety gear provided. Refreshments and photo stops included.', price: 800, seats: 200 },
  { category: 'sports', title: 'Badminton Tournament', description: 'Amateur badminton tournament. Singles and doubles categories. Prizes for winners. Registration required.', price: 1000, seats: 100 },
  { category: 'sports', title: 'Swimming Competition', description: 'Competitive swimming event with multiple categories. Professional timing and medals for winners.', price: 500, seats: 500 },
  { category: 'sports', title: 'Basketball Tournament', description: '3v3 basketball tournament. Teams can register. Trophies and cash prizes. Referees and equipment provided.', price: 1200, seats: 200 },
  
  // Wellness Events - Indian wellness
  { category: 'wellness', title: 'Yoga Retreat - Weekend', description: '2-day yoga retreat in peaceful surroundings. Multiple sessions, meditation, healthy meals, and accommodation included.', price: 5000, seats: 30 },
  { category: 'wellness', title: 'Meditation Workshop', description: 'Learn various meditation techniques from experienced teachers. Mindfulness, breathing exercises, and stress relief methods.', price: 1500, seats: 50 },
  { category: 'wellness', title: 'Ayurveda Wellness Session', description: 'Traditional Ayurvedic consultation, massage therapy, and wellness guidance. Personalized health recommendations.', price: 3000, seats: 20 },
  { category: 'wellness', title: 'Spa Day - Full Body Treatment', description: 'Relaxing spa experience with full body massage, facial, and aromatherapy. Refreshments included.', price: 4000, seats: 15 },
  { category: 'wellness', title: 'Health & Wellness Expo', description: 'Explore natural health products, organic foods, and wellness services. Free health checkups and consultations.', price: 200, seats: 2000 },
  { category: 'wellness', title: 'Detox Program - 3 Days', description: 'Comprehensive detox program with yoga, meditation, healthy meals, and wellness activities. Accommodation included.', price: 8000, seats: 25 },
  { category: 'wellness', title: 'Mindfulness Workshop', description: 'Learn mindfulness techniques for daily life. Stress management, emotional regulation, and mental well-being practices.', price: 2000, seats: 40 },
  { category: 'wellness', title: 'Reiki Healing Session', description: 'Energy healing session with certified Reiki master. Chakra balancing and stress relief. Individual sessions.', price: 2500, seats: 10 }
];

function generateEvent() {
  // Pick a random realistic event template
  const eventTemplate = realisticEvents[Math.floor(Math.random() * realisticEvents.length)];
  const cityData = cities[Math.floor(Math.random() * cities.length)];
  const venue = cityData.venues[Math.floor(Math.random() * cityData.venues.length)];
  
  // Add city name to title if not already there
  let title = eventTemplate.title;
  if (!title.includes(cityData.city)) {
    title = `${eventTemplate.title} - ${cityData.city}`;
  }
  
  // Enhance description with location details
  const description = `${eventTemplate.description} Join us at ${venue} in ${cityData.city}, ${cityData.state} for an unforgettable experience.`;
  
  return {
    title,
    description,
    date: getRandomFutureDate(7, 120),
    location: `${venue}, ${cityData.city}, ${cityData.state}`,
    price: eventTemplate.price,
    total_seats: eventTemplate.seats,
    image_url: getRandomImage(eventTemplate.category)
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

    // Generate 70 realistic events
    const eventsToCreate = [];
    for (let i = 0; i < 70; i++) {
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
              console.log(`✅ [${created}/70] Created: ${e.title}`);
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
