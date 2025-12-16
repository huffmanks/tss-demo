CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "categories_organization_title_unique" UNIQUE("organization_id","title")
);
--> statement-breakpoint
CREATE TABLE "cuisines" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "cuisines_organization_title_unique" UNIQUE("organization_id","title")
);
--> statement-breakpoint
CREATE TABLE "diets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "diets_organization_title_unique" UNIQUE("organization_id","title")
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredient_sections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"position" integer NOT NULL,
	"recipe_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "ingredient_sections_recipe_position_unique" UNIQUE("recipe_id","organization_id","position")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"amount" numeric(9, 3),
	"name" text NOT NULL,
	"position" integer NOT NULL,
	"section_id" uuid NOT NULL,
	"unit_id" uuid,
	CONSTRAINT "ingredients_section_position_unique" UNIQUE("section_id","position")
);
--> statement-breakpoint
CREATE TABLE "instruction_sections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"position" integer NOT NULL,
	"recipe_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "instruction_sections_recipe_position_unique" UNIQUE("recipe_id","organization_id","position")
);
--> statement-breakpoint
CREATE TABLE "instructions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"position" integer NOT NULL,
	"section_id" uuid NOT NULL,
	CONSTRAINT "instructions_section_position_unique" UNIQUE("section_id","position")
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "organizations_name_unique" UNIQUE("name"),
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "passkeys" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"user_id" uuid NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"aaguid" text
);
--> statement-breakpoint
CREATE TABLE "recipe_categories" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipe_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "recipe_categories_recipe_category_unique" UNIQUE("recipe_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_cuisines" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipe_id" uuid NOT NULL,
	"cuisine_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "recipe_cuisines_recipe_cuisine_unique" UNIQUE("recipe_id","cuisine_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_diets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipe_id" uuid NOT NULL,
	"diet_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "recipe_diets_recipe_diet_unique" UNIQUE("recipe_id","diet_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_images" (
	"id" uuid PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"recipe_id" uuid NOT NULL,
	"image_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "recipe_images_recipe_position_unique" UNIQUE("recipe_id","organization_id","position")
);
--> statement-breakpoint
CREATE TABLE "recipe_organization_shares" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipe_id" uuid NOT NULL,
	"source_organization_id" uuid NOT NULL,
	"target_organization_id" uuid NOT NULL,
	CONSTRAINT "recipe_organization_shares_recipe_target_org_unique" UNIQUE("recipe_id","target_organization_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_public_shares" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipe_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_public_shares_recipe_org_unique" UNIQUE("organization_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_tags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipe_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "recipe_tags_recipe_tag_unique" UNIQUE("recipe_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"prep_time" integer,
	"cook_time" integer,
	"serving_size" integer NOT NULL,
	"author_notes" text,
	"nutrition" jsonb,
	"organization_id" uuid NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recipes_organization_id_title_unique" UNIQUE("organization_id","title"),
	CONSTRAINT "recipes_organization_id_slug_unique" UNIQUE("organization_id","slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"impersonated_by" text,
	"active_organization_id" uuid,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "tags_organization_title_unique" UNIQUE("organization_id","title")
);
--> statement-breakpoint
CREATE TABLE "two_factors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"abbreviation" text NOT NULL,
	"type" text NOT NULL,
	"system" text NOT NULL,
	"organization_id" uuid NOT NULL,
	CONSTRAINT "units_name_organization_unique" UNIQUE("organization_id","name"),
	CONSTRAINT "units_abbr_organization_unique" UNIQUE("organization_id","abbreviation")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"two_factor_enabled" boolean DEFAULT false,
	"active_organization_id" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuisines" ADD CONSTRAINT "cuisines_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diets" ADD CONSTRAINT "diets_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient_sections" ADD CONSTRAINT "ingredient_sections_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient_sections" ADD CONSTRAINT "ingredient_sections_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_section_id_ingredient_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."ingredient_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instruction_sections" ADD CONSTRAINT "instruction_sections_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instruction_sections" ADD CONSTRAINT "instruction_sections_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructions" ADD CONSTRAINT "instructions_section_id_instruction_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."instruction_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_categories" ADD CONSTRAINT "recipe_categories_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_categories" ADD CONSTRAINT "recipe_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_categories" ADD CONSTRAINT "recipe_categories_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_cuisines" ADD CONSTRAINT "recipe_cuisines_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_cuisines" ADD CONSTRAINT "recipe_cuisines_cuisine_id_cuisines_id_fk" FOREIGN KEY ("cuisine_id") REFERENCES "public"."cuisines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_cuisines" ADD CONSTRAINT "recipe_cuisines_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_diets" ADD CONSTRAINT "recipe_diets_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_diets" ADD CONSTRAINT "recipe_diets_diet_id_diets_id_fk" FOREIGN KEY ("diet_id") REFERENCES "public"."diets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_diets" ADD CONSTRAINT "recipe_diets_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_images" ADD CONSTRAINT "recipe_images_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_images" ADD CONSTRAINT "recipe_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_images" ADD CONSTRAINT "recipe_images_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_organization_shares" ADD CONSTRAINT "recipe_organization_shares_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_organization_shares" ADD CONSTRAINT "recipe_organization_shares_source_organization_id_organizations_id_fk" FOREIGN KEY ("source_organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_organization_shares" ADD CONSTRAINT "recipe_organization_shares_target_organization_id_organizations_id_fk" FOREIGN KEY ("target_organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_public_shares" ADD CONSTRAINT "recipe_public_shares_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_public_shares" ADD CONSTRAINT "recipe_public_shares_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_active_organization_id_organizations_id_fk" FOREIGN KEY ("active_organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factors" ADD CONSTRAINT "two_factors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_active_organization_id_organizations_id_fk" FOREIGN KEY ("active_organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "categories_organization_id_idx" ON "categories" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "cuisines_organization_id_idx" ON "cuisines" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "diets_organization_id_idx" ON "diets" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "images_organization_id_idx" ON "images" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "ingredient_sections_recipe_id_idx" ON "ingredient_sections" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "ingredient_sections_organization_id_idx" ON "ingredient_sections" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "ingredients_section_id_idx" ON "ingredients" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "ingredients_unit_id_idx" ON "ingredients" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "instruction_sections_recipe_id_idx" ON "instruction_sections" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "instruction_sections_organization_id_idx" ON "instruction_sections" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "instructions_section_id_idx" ON "instructions" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "invitations_organizationId_idx" ON "invitations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitations_email_idx" ON "invitations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "members_organizationId_idx" ON "members" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "members_userId_idx" ON "members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passkeys_userId_idx" ON "passkeys" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passkeys_credentialID_idx" ON "passkeys" USING btree ("credential_id");--> statement-breakpoint
CREATE INDEX "recipe_categories_category_id_idx" ON "recipe_categories" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "recipe_categories_recipe_id_idx" ON "recipe_categories" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_categories_organization_id_idx" ON "recipe_categories" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "recipe_cuisines_cuisine_id_idx" ON "recipe_cuisines" USING btree ("cuisine_id");--> statement-breakpoint
CREATE INDEX "recipe_cuisines_recipe_id_idx" ON "recipe_cuisines" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_cuisines_organization_id_idx" ON "recipe_cuisines" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "recipe_diets_diet_id_idx" ON "recipe_diets" USING btree ("diet_id");--> statement-breakpoint
CREATE INDEX "recipe_diets_recipe_id_idx" ON "recipe_diets" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_diets_organization_id_idx" ON "recipe_diets" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "recipe_images_recipe_id_idx" ON "recipe_images" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_images_image_id_idx" ON "recipe_images" USING btree ("image_id");--> statement-breakpoint
CREATE INDEX "recipe_images_organization_id_idx" ON "recipe_images" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "recipe_organization_shares_recipe_id_idx" ON "recipe_organization_shares" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_organization_shares_source_org_id_idx" ON "recipe_organization_shares" USING btree ("source_organization_id");--> statement-breakpoint
CREATE INDEX "recipe_organization_shares_target_org_id_idx" ON "recipe_organization_shares" USING btree ("target_organization_id");--> statement-breakpoint
CREATE INDEX "recipe_public_shares_recipe_id_idx" ON "recipe_public_shares" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_public_shares_organization_id_idx" ON "recipe_public_shares" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "recipe_tags_tag_id_idx" ON "recipe_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "recipe_tags_recipe_id_idx" ON "recipe_tags" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_tags_organization_id_idx" ON "recipe_tags" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "recipes_userId_idx" ON "recipes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recipes_organizationId_idx" ON "recipes" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_activeOrganizationId_idx" ON "sessions" USING btree ("active_organization_id");--> statement-breakpoint
CREATE INDEX "tags_organization_id_idx" ON "tags" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "twoFactors_secret_idx" ON "two_factors" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "twoFactors_userId_idx" ON "two_factors" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "units_organization_id_idx" ON "units" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "users_activeOrganizationId_idx" ON "users" USING btree ("active_organization_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");