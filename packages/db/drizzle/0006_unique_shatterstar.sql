CREATE TABLE `user` (
	`id` text NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`social` blob DEFAULT '{"github":"","x":"","website":"","linkedin":""}'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);