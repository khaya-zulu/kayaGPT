PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chat` (
	`id` text NOT NULL,
	`text` text NOT NULL,
	`updated_at` text,
	`created_at` text
);
--> statement-breakpoint
INSERT INTO `__new_chat`("id", "text", "updated_at", "created_at") SELECT "id", "text", "updated_at", "created_at" FROM `chat`;--> statement-breakpoint
DROP TABLE `chat`;--> statement-breakpoint
ALTER TABLE `__new_chat` RENAME TO `chat`;--> statement-breakpoint
PRAGMA foreign_keys=ON;