const prisma = require('../config/db');

const requireAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking user role' });
  }
};

module.exports = { requireAdmin };

