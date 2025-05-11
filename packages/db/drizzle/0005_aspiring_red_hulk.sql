PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chat_message` (
	`id` text NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`chat_id` text NOT NULL,
	`created_at` text
);
--> statement-breakpoint
INSERT INTO `__new_chat_message`("id", "content", "role", "chat_id", "created_at") SELECT "id", "content", "role", "chat_id", "created_at" FROM `chat_message`;--> statement-breakpoint
DROP TABLE `chat_message`;--> statement-breakpoint
ALTER TABLE `__new_chat_message` RENAME TO `chat_message`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `chat_message_id_unique` ON `chat_message` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `chat_id_unique` ON `chat` (`id`);