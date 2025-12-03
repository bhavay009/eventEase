const prisma = require('../config/db');

const getAnalytics = async (req, res) => {
  try {
    // Total events
    const totalEvents = await prisma.event.count();

    // Total bookings
    const totalBookings = await prisma.booking.count();

    // Total users
    const totalUsers = await prisma.user.count();

    // Total revenue
    const revenueResult = await prisma.booking.aggregate({
      where: {
        payment_status: 'paid'
      },
      _sum: {
        amount: true
      }
    });
    const totalRevenue = revenueResult._sum.amount || 0;

    // Bookings per event
    const eventsWithBookings = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { bookings: true }
        }
      },
      take: 50
    });
    
    const bookingsPerEvent = eventsWithBookings
      .sort((a, b) => b._count.bookings - a._count.bookings)
      .slice(0, 10);

    // Monthly revenue
    const monthlyRevenueRaw = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as revenue
      FROM Booking
      WHERE payment_status = 'paid'
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `;
    const monthlyRevenue = Array.isArray(monthlyRevenueRaw)
      ? monthlyRevenueRaw.map(r => ({
          month: r.month,
          revenue: Number(r.revenue) || 0
        }))
      : [];

    // Seat occupancy per event
    const events = await prisma.event.findMany({
      include: {
        bookings: true
      }
    });

    const seatOccupancy = events.map(event => {
      const bookedSeats = event.bookings.reduce((sum, b) => sum + b.seats, 0);
      const occupancyRate = event.total_seats > 0 
        ? (bookedSeats / event.total_seats) * 100 
        : 0;
      
      return {
        event_id: event.id,
        event_title: event.title,
        total_seats: event.total_seats,
        booked_seats,
        remaining_seats: event.total_seats - bookedSeats,
        occupancy_rate: Math.round(occupancyRate * 100) / 100
      };
    });

    // Recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      analytics: {
        totalEvents,
        totalBookings,
        totalUsers,
        totalRevenue,
        bookingsPerEvent,
        monthlyRevenue,
        seatOccupancy,
        recentBookings
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
};

module.exports = { getAnalytics };

