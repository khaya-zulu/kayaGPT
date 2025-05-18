PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chat` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`updated_at` integer,
	`created_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_chat`("id", "text", "updated_at", "created_at", "deleted_at") SELECT "id", "text", "updated_at", "created_at", "deleted_at" FROM `chat`;--> statement-breakpoint
DROP TABLE `chat`;--> statement-breakpoint
ALTER TABLE `__new_chat` RENAME TO `chat`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_chat_message` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`chat_id` text NOT NULL,
	`created_at` integer
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
	`description` text DEFAULT '',
	`settings` text DEFAULT '{"50":"#fafafa","100":"#f4f4f5","200":"#e4e4e7","300":"#d4d4d8","400":"#a1a1aa","600":"#52525b","700":"#3f3f46","800":"#27272a","900":"#18181b","base":"#71717a"}',
	`social` text DEFAULT '{"github":"","x":"","website":"","linkedin":""}'
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "username", "name", "email", "description", "settings", "social") SELECT "id", "username", "name", "email", "description", "settings", "social" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);