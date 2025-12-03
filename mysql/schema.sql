-- EventEase Database Schema
-- Compatible with MySQL (PlanetScale, Railway MySQL)
-- Note: Prisma will automatically create tables with proper naming

-- Users Table
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'attendee',
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `idx_email` (`email`)
);

-- Events Table
CREATE TABLE IF NOT EXISTS `Event` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `date` DATETIME(3) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `total_seats` INT NOT NULL,
  `image_url` VARCHAR(500),
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_date` (`date`),
  INDEX `idx_location` (`location`)
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS `Session` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `start_time` DATETIME(3) NOT NULL,
  `end_time` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE CASCADE,
  INDEX `idx_event_id` (`event_id`)
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS `Booking` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `seats` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `payment_status` VARCHAR(50) DEFAULT 'pending',
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_event_id` (`event_id`),
  INDEX `idx_created_at` (`created_at`)
);
