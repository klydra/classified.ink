CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`blob` text NOT NULL,
	`iv` text NOT NULL,
	FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`username` text PRIMARY KEY NOT NULL,
	`secret_key` text NOT NULL
);
