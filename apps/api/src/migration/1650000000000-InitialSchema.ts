import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1650000000000 implements MigrationInterface {
    name = 'InitialSchema1650000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password_hash" character varying NOT NULL,
                "full_name" character varying NOT NULL,
                "role" character varying NOT NULL,
                "phone" character varying,
                "avatar_url" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                "last_login" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        // Create leads table
        await queryRunner.query(`
            CREATE TABLE "leads" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "source" character varying NOT NULL,
                "status" character varying NOT NULL,
                "priority" integer NOT NULL DEFAULT 0,
                "interested_car_model" character varying,
                "budget_min" numeric(10,2),
                "budget_max" numeric(10,2),
                "preferred_contact_time" character varying,
                "financing_needed" boolean NOT NULL DEFAULT false,
                "trade_in_vehicle" character varying,
                "assigned_to" uuid,
                "assigned_at" TIMESTAMP WITH TIME ZONE,
                "lead_score" integer NOT NULL DEFAULT 0,
                "tags" text[],
                "notes" text,
                "first_contacted_at" TIMESTAMP WITH TIME ZONE,
                "last_contacted_at" TIMESTAMP WITH TIME ZONE,
                "converted_at" TIMESTAMP WITH TIME ZONE,
                "expected_close_date" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5e3804c9e9f3c2e7a4f3b5b8f6a" PRIMARY KEY ("id")
            )
        `);

        // Create index on leads.status
        await queryRunner.query(`
            CREATE INDEX "IDX_leads_status" ON "leads" ("status")
        `);

        // Create index on leads.assigned_to
        await queryRunner.query(`
            CREATE INDEX "IDX_leads_assigned_to" ON "leads" ("assigned_to")
        `);

        // Create index on leads.source
        await queryRunner.query(`
            CREATE INDEX "IDX_leads_source" ON "leads" ("source")
        `);

        // Create index on leads.created_at (descending)
        await queryRunner.query(`
            CREATE INDEX "IDX_leads_created_at" ON "leads" ("created_at" DESC)
        `);

        // Create lead_activities table
        await queryRunner.query(`
            CREATE TABLE "lead_activities" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "lead_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                "activity_type" character varying NOT NULL,
                "description" text NOT NULL,
                "outcome" text,
                "duration_minutes" integer,
                "scheduled_at" TIMESTAMP WITH TIME ZONE,
                "completed_at" TIMESTAMP WITH TIME ZONE,
                "metadata" jsonb,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_lead_activities" PRIMARY KEY ("id")
            )
        `);

        // Create index on lead_activities.lead_id
        await queryRunner.query(`
            CREATE INDEX "IDX_lead_activities_lead_id" ON "lead_activities" ("lead_id")
        `);

        // Create lead_status_history table
        await queryRunner.query(`
            CREATE TABLE "lead_status_history" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "lead_id" uuid NOT NULL,
                "old_status" character varying NOT NULL,
                "new_status" character varying NOT NULL,
                "changed_by" uuid NOT NULL,
                "changed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_lead_status_history" PRIMARY KEY ("id")
            )
        `);

        // Create automation_rules table
        await queryRunner.query(`
            CREATE TABLE "automation_rules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "trigger_event" character varying NOT NULL,
                "conditions" jsonb NOT NULL,
                "actions" jsonb NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "priority" integer NOT NULL DEFAULT 0,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_automation_rules" PRIMARY KEY ("id")
            )
        `);

        // Create notifications table
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "title" character varying NOT NULL,
                "message" text NOT NULL,
                "type" character varying NOT NULL,
                "is_read" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
            )
        `);

        // Create index on notifications.user_id and is_read
        await queryRunner.query(`
            CREATE INDEX "IDX_notifications_user_id_is_read" ON "notifications" ("user_id", "is_read")
        `);

        // Create daily_metrics table
        await queryRunner.query(`
            CREATE TABLE "daily_metrics" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "date" date NOT NULL,
                "leads_assigned" integer NOT NULL DEFAULT 0,
                "leads_contacted" integer NOT NULL DEFAULT 0,
                "leads_qualified" integer NOT NULL DEFAULT 0,
                "leads_converted" integer NOT NULL DEFAULT 0,
                "calls_made" integer NOT NULL DEFAULT 0,
                "emails_sent" integer NOT NULL DEFAULT 0,
                "meetings_held" integer NOT NULL DEFAULT 0,
                "total_activities" integer NOT NULL DEFAULT 0,
                "CONSTRAINT "UQ_daily_metrics_user_id_date" UNIQUE ("user_id", "date")",
                CONSTRAINT "PK_daily_metrics" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        // leads.assigned_to -> users.id
        await queryRunner.query(`
            ALTER TABLE "leads"
            ADD CONSTRAINT "FK_leads_assigned_to_users"
            FOREIGN KEY ("assigned_to")
            REFERENCES "users"("id")
            ON DELETE SET NULL
        `);

        // lead_activities.lead_id -> leads.id
        await queryRunner.query(`
            ALTER TABLE "lead_activities"
            ADD CONSTRAINT "FK_lead_activities_lead_id"
            FOREIGN KEY ("lead_id")
            REFERENCES "leads"("id")
            ON DELETE CASCADE
        `);

        // lead_activities.user_id -> users.id
        await queryRunner.query(`
            ALTER TABLE "lead_activities"
            ADD CONSTRAINT "FK_lead_activities_user_id"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
        `);

        // lead_status_history.lead_id -> leads.id
        await queryRunner.query(`
            ALTER TABLE "lead_status_history"
            ADD CONSTRAINT "FK_lead_status_history_lead_id"
            FOREIGN KEY ("lead_id")
            REFERENCES "leads"("id")
            ON DELETE CASCADE
        `);

        // lead_status_history.changed_by -> users.id
        await queryRunner.query(`
            ALTER TABLE "lead_status_history"
            ADD CONSTRAINT "FK_lead_status_history_changed_by"
            FOREIGN KEY ("changed_by")
            REFERENCES "users"("id")
            ON DELETE CASCADE
        `);

        // notifications.user_id -> users.id
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD CONSTRAINT "FK_notifications_user_id"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
        `);

        // daily_metrics.user_id -> users.id
        await queryRunner.query(`
            ALTER TABLE "daily_metrics"
            ADD CONSTRAINT "FK_daily_metrics_user_id"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "daily_metrics" DROP CONSTRAINT "FK_daily_metrics_user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "lead_status_history" DROP CONSTRAINT "FK_lead_status_history_changed_by"
        `);
        await queryRunner.query(`
            ALTER TABLE "lead_status_history" DROP CONSTRAINT "FK_lead_status_history_lead_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "lead_activities" DROP CONSTRAINT "FK_lead_activities_user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "lead_activities" DROP CONSTRAINT "FK_lead_activities_lead_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "leads" DROP CONSTRAINT "FK_leads_assigned_to_users"
        `);

        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE "daily_metrics"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "automation_rules"`);
        await queryRunner.query(`DROP TABLE "lead_status_history"`);
        await queryRunner.query(`DROP TABLE "lead_activities"`);
        await queryRunner.query(`DROP TABLE "leads"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}