require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');

const prisma = new PrismaClient();

// MySQL connection (your old database)
const mysqlConfig = {
  host: 'nozomi.proxy.rlwy.net',
  port: 16982,
  user: 'root',
  password: 'TtqyQAlWgnwuHscIzoHVtFNxZrlsxliK',
  database: 'railway'
};

async function migrateData() {
  let mysqlConnection;
  
  try {
    console.log('🔄 Starting data migration from MySQL to PostgreSQL...');
    
    // Connect to MySQL
    console.log('📡 Connecting to MySQL database...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connected to MySQL');
    
    // Fetch all events from MySQL
    console.log('📥 Fetching events from MySQL...');
    const [events] = await mysqlConnection.execute(
      'SELECT * FROM `Event` ORDER BY id'
    );
    console.log(`✅ Found ${events.length} events in MySQL`);
    
    if (events.length === 0) {
      console.log('⚠️  No events found in MySQL database');
      return;
    }
    
    // Check if admin user exists in PostgreSQL, create if not
    let adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    if (!adminUser) {
      console.log('👤 Creating admin user in PostgreSQL...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@eventease.com',
          password: hashedPassword,
          name: 'EventEase Admin',
          role: 'admin'
        }
      });
      console.log('✅ Admin user created');
    } else {
      console.log(`✅ Using existing admin user: ${adminUser.email}`);
    }
    
    // Migrate events
    console.log('📤 Migrating events to PostgreSQL...');
    let migrated = 0;
    let skipped = 0;
    
    for (const event of events) {
      try {
        // Check if event already exists (by title and date)
        const existing = await prisma.event.findFirst({
          where: {
            title: event.title,
            date: new Date(event.date)
          }
        });
        
        if (existing) {
          console.log(`⏭️  Skipping duplicate: ${event.title}`);
          skipped++;
          continue;
        }
        
        // Create event in PostgreSQL
        await prisma.event.create({
          data: {
            title: event.title,
            description: event.description,
            date: new Date(event.date),
            location: event.location,
            price: parseFloat(event.price),
            total_seats: parseInt(event.total_seats),
            image_url: event.image_url || null,
            organizer_id: adminUser.id,
            created_at: new Date(event.created_at),
            updated_at: new Date(event.updated_at || event.created_at)
          }
        });
        
        migrated++;
        console.log(`✅ [${migrated}/${events.length}] Migrated: ${event.title}`);
      } catch (error) {
        console.error(`❌ Error migrating event "${event.title}":`, error.message);
      }
    }
    
    // Migrate sessions
    console.log('\n📥 Fetching sessions from MySQL...');
    const [sessions] = await mysqlConnection.execute(
      'SELECT * FROM `Session` ORDER BY id'
    );
    console.log(`✅ Found ${sessions.length} sessions in MySQL`);
    
    if (sessions.length > 0) {
      console.log('📤 Migrating sessions to PostgreSQL...');
      let sessionMigrated = 0;
      
      for (const session of sessions) {
        try {
          // Find the corresponding event in PostgreSQL
          const mysqlEvent = events.find(e => e.id === session.event_id);
          if (!mysqlEvent) {
            console.log(`⚠️  Event not found for session ${session.id}, skipping`);
            continue;
          }
          
          const pgEvent = await prisma.event.findFirst({
            where: {
              title: mysqlEvent.title,
              date: new Date(mysqlEvent.date)
            }
          });
          
          if (!pgEvent) {
            console.log(`⚠️  PostgreSQL event not found for session ${session.id}, skipping`);
            continue;
          }
          
          await prisma.session.create({
            data: {
              event_id: pgEvent.id,
              start_time: new Date(session.start_time),
              end_time: new Date(session.end_time),
              created_at: new Date(session.created_at)
            }
          });
          
          sessionMigrated++;
        } catch (error) {
          console.error(`❌ Error migrating session ${session.id}:`, error.message);
        }
      }
      console.log(`✅ Migrated ${sessionMigrated} sessions`);
    }
    
    // Migrate users (if any)
    console.log('\n📥 Fetching users from MySQL...');
    const [users] = await mysqlConnection.execute(
      'SELECT * FROM `User` ORDER BY id'
    );
    console.log(`✅ Found ${users.length} users in MySQL`);
    
    if (users.length > 0) {
      console.log('📤 Migrating users to PostgreSQL...');
      let userMigrated = 0;
      
      for (const user of users) {
        try {
          const existing = await prisma.user.findFirst({
            where: { email: user.email }
          });
          
          if (existing) {
            console.log(`⏭️  Skipping duplicate user: ${user.email}`);
            continue;
          }
          
          await prisma.user.create({
            data: {
              email: user.email,
              password: user.password, // Keep the hashed password
              name: user.name,
              role: user.role,
              created_at: new Date(user.created_at)
            }
          });
          
          userMigrated++;
        } catch (error) {
          console.error(`❌ Error migrating user "${user.email}":`, error.message);
        }
      }
      console.log(`✅ Migrated ${userMigrated} users`);
    }
    
    // Migrate bookings (if any)
    console.log('\n📥 Fetching bookings from MySQL...');
    const [bookings] = await mysqlConnection.execute(
      'SELECT * FROM `Booking` ORDER BY id'
    );
    console.log(`✅ Found ${bookings.length} bookings in MySQL`);
    
    if (bookings.length > 0) {
      console.log('📤 Migrating bookings to PostgreSQL...');
      let bookingMigrated = 0;
      
      for (const booking of bookings) {
        try {
          // Find corresponding user and event in PostgreSQL
          const mysqlEvent = events.find(e => e.id === booking.event_id);
          if (!mysqlEvent) continue;
          
          const pgEvent = await prisma.event.findFirst({
            where: {
              title: mysqlEvent.title,
              date: new Date(mysqlEvent.date)
            }
          });
          
          if (!pgEvent) continue;
          
          const pgUser = await prisma.user.findFirst({
            where: { email: booking.user_email || 'unknown@example.com' }
          });
          
          if (!pgUser) {
            console.log(`⚠️  User not found for booking ${booking.id}, skipping`);
            continue;
          }
          
          await prisma.booking.create({
            data: {
              user_id: pgUser.id,
              event_id: pgEvent.id,
              seats: parseInt(booking.seats),
              amount: parseFloat(booking.amount),
              payment_status: booking.payment_status,
              created_at: new Date(booking.created_at)
            }
          });
          
          bookingMigrated++;
        } catch (error) {
          console.error(`❌ Error migrating booking ${booking.id}:`, error.message);
        }
      }
      console.log(`✅ Migrated ${bookingMigrated} bookings`);
    }
    
    console.log('\n🎉 Migration completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Events: ${migrated} migrated, ${skipped} skipped`);
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
      console.log('🔌 MySQL connection closed');
    }
    await prisma.$disconnect();
    console.log('🔌 PostgreSQL connection closed');
  }
}

migrateData();

