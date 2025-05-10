PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chat_message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`chat_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_chat_message`("id", "content", "role", "chat_id") SELECT "id", "content", "role", "chat_id" FROM `chat_message`;--> statement-breakpoint
DROP TABLE `chat_message`;--> statement-breakpoint
ALTER TABLE `__new_chat_message` RENAME TO `chat_message`;--> statement-breakpoint
PRAGMA foreign_keys=ON;