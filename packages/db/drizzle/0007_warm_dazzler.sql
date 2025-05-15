PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chat` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`updated_at` text,
	`created_at` text
);
--> statement-breakpoint
INSERT INTO `__new_chat`("id", "text", "updated_at", "created_at") SELECT "id", "text", "updated_at", "created_at" FROM `chat`;--> statement-breakpoint
DROP TABLE `chat`;--> statement-breakpoint
ALTER TABLE `__new_chat` RENAME TO `chat`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_chat_message` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`chat_id` text NOT NULL,
	`created_at` text
);
--> statement-breakpoint
INSERT INTO `__new_chat_message`("id", "content", "role", "chat_id", "created_at") SELECT "id", "content", "role", "chat_id", "created_at" FROM `chat_message`;--> statement-breakpoint
DROP TABLE `chat_message`;--> statement-breakpoint
ALTER TABLE `__new_chat_message` RENAME TO `chat_message`;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`social` blob DEFAULT '{"github":"","x":"","website":"","linkedin":""}'
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "username", "name", "email", "social") SELECT "id", "username", "name", "email", "social" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);