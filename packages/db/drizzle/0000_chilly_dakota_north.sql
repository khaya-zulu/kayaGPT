CREATE TABLE `chat` (
	`id` text PRIMARY KEY NOT NULL,
	`name` integer NOT NULL,
	`updated_at` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chat_message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`chat_id` integer NOT NULL
);
