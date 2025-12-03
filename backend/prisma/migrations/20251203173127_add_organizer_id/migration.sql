-- Step 1: Add organizer_id as nullable first
ALTER TABLE `Event` ADD COLUMN `organizer_id` INTEGER NULL;

-- Step 2: Set organizer_id for existing events to the first admin user (or first user if no admin exists)
UPDATE `Event` 
SET `organizer_id` = (
  SELECT `id` FROM `User` WHERE `role` = 'admin' LIMIT 1
)
WHERE `organizer_id` IS NULL;

-- If no admin exists, use the first user
UPDATE `Event` 
SET `organizer_id` = (
  SELECT `id` FROM `User` ORDER BY `id` LIMIT 1
)
WHERE `organizer_id` IS NULL;

-- Step 3: Make organizer_id required
ALTER TABLE `Event` MODIFY COLUMN `organizer_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Event_organizer_id_idx` ON `Event`(`organizer_id`);

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_organizer_id_fkey` FOREIGN KEY (`organizer_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
