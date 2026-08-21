CREATE TYPE "public"."booking_status" AS ENUM('confirmed', 'pending', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."email_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."email_type" AS ENUM('booking_confirmation', 'booking_cancelled', 'booking_rescheduled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'manager');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"role" "user_role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_auth_user_id_unique" UNIQUE("auth_user_id")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"treatment_id" text NOT NULL,
	"treatment_name" text NOT NULL,
	"price_label" text,
	"employee_id" text NOT NULL,
	"employee_name" text NOT NULL,
	"customer_id" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"status" "booking_status" DEFAULT 'confirmed' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"booking_source" text DEFAULT 'online' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" text,
	"recipient" text NOT NULL,
	"type" "email_type" NOT NULL,
	"status" "email_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"storage_path" text,
	"file_hash" text,
	"alt_text" text DEFAULT '' NOT NULL,
	"caption" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treatments" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"name" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"price" text NOT NULL,
	"image" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_employee_date_idx" ON "bookings" USING btree ("employee_id","date");--> statement-breakpoint
CREATE INDEX "bookings_customer_id_idx" ON "bookings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "gallery_images_file_hash_idx" ON "gallery_images" USING btree ("file_hash");--> statement-breakpoint
CREATE INDEX "gallery_images_sort_order_idx" ON "gallery_images" USING btree ("sort_order");
--> statement-breakpoint
INSERT INTO "gallery_images" ("url", "file_hash", "alt_text", "caption", "sort_order") VALUES
  ('/images/gallery/1.webp', '7e9f512e9cd621f1803d63cfcc1fe48d505e4fec55d063a2cc8919837621e259', 'Klassisk herreklip set fra siden', 'Klassisk herreklip', 0),
  ('/images/gallery/2.webp', '5b0af7aaddad5878d1bb9d4c80502349fabd52e2863c46ca6b8cddd61d08725f', 'Skin fade set fra siden', 'Skin fade', 1),
  ('/images/gallery/3.webp', 'bea6d4c588fb74dd8365c23b11b864bccede73620aca6ba0dc6125d65836097b', 'Formet og trimmet skæg', 'Skægtrimning', 2),
  ('/images/gallery/4.webp', 'b12308167f10f10baeab599af9fe7d6f97ddb8adf08bc76b810c3f829fa014e6', 'Herreklip med formet skæg', 'Hår og skæg', 3),
  ('/images/gallery/5.webp', '2ee74fd1b0e5043fe35fe030ac10e42eb0b567422c31593b8964680f85e31102', 'Frisørsalonen hos FRISØR KBH', 'Salonen', 4)
ON CONFLICT ("file_hash") DO NOTHING;
