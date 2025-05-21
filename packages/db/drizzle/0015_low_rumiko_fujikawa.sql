PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chat_message` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`chat_id` text NOT NULL,
	`created_at` integer,
	`tools` text DEFAULT '[]'
);
--> statement-breakpoint
INSERT INTO `__new_chat_message`("id", "content", "role", "chat_id", "created_at", "tools") SELECT "id", "content", "role", "chat_id", "created_at", "tools" FROM `chat_message`;--> statement-breakpoint
DROP TABLE `chat_message`;--> statement-breakpoint
ALTER TABLE `__new_chat_message` RENAME TO `chat_message`;--> statement-breakpoint
PRAGMA foreign_keys=ON;