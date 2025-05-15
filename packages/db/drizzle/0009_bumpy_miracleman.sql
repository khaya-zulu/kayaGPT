PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`description` text DEFAULT '',
	`social` blob DEFAULT '{"github":"","x":"","website":"","linkedin":""}'
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "username", "name", "email", "description", "social") SELECT "id", "username", "name", "email", "description", "social" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);