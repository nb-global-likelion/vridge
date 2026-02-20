-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateFunction
create or replace function public.generate_profile_slug()
returns text
language sql
volatile
as $fn$
  with
  adjs as (
    select (array[
      'brave','calm','clever','bright','gentle','mighty','nimble','quiet','rapid','sly',
      'sunny','bold','witty','eager','loyal','kind','fierce','proud','swift','steady'
    ])[1 + floor(random() * 20)::int] as adj
  ),
  nouns as (
    select (array[
      'otter','falcon','tiger','panda','wolf','lion','whale','fox','eagle','badger',
      'sparrow','koala','dolphin','rabbit','yak','orca','gecko','heron','lynx','beaver'
    ])[1 + floor(random() * 20)::int] as noun
  )
  select format(
    '%s-%s-%s',
    (select adj from adjs),
    (select noun from nouns),
    lpad((floor(random() * 10000))::int::text, 4, '0')
  );
$fn$;

-- CreateEnum
CREATE TYPE "app_role" AS ENUM ('candidate', 'recruiter', 'admin');

-- CreateEnum
CREATE TYPE "employment_type" AS ENUM ('full_time', 'part_time', 'intern', 'freelance');

-- CreateEnum
CREATE TYPE "work_arrangement" AS ENUM ('onsite', 'hybrid', 'remote');

-- CreateEnum
CREATE TYPE "job_posting_status" AS ENUM ('recruiting', 'done');

-- CreateEnum
CREATE TYPE "language_proficiency" AS ENUM ('native', 'fluent', 'professional', 'basic');

-- CreateEnum
CREATE TYPE "education_type_vn" AS ENUM ('vet_elementary', 'vet_intermediate', 'vet_college', 'higher_bachelor', 'higher_master', 'higher_doctorate', 'continuing_education', 'international_program', 'other');

-- CreateEnum
CREATE TYPE "attachment_type" AS ENUM ('pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg');

-- CreateEnum
CREATE TYPE "apply_status" AS ENUM ('applied', 'accepted', 'rejected', 'withdrawn');

-- CreateEnum
CREATE TYPE "experience_level" AS ENUM ('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD');

-- CreateEnum
CREATE TYPE "graduation_status" AS ENUM ('ENROLLED', 'ON_LEAVE', 'GRADUATED', 'EXPECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "salary_period" AS ENUM ('year', 'month', 'hour');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "access_token_expires_at" TIMESTAMPTZ,
    "refresh_token_expires_at" TIMESTAMPTZ,
    "scope" TEXT,
    "id_token" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_users" (
    "id" UUID NOT NULL,
    "org_id" UUID,
    "role" "app_role" NOT NULL DEFAULT 'candidate',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "app_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles_public" (
    "user_id" UUID NOT NULL,
    "first_name" TEXT NOT NULL DEFAULT '',
    "last_name" TEXT NOT NULL DEFAULT '',
    "about_me" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "public_slug" TEXT NOT NULL DEFAULT generate_profile_slug(),
    "date_of_birth" DATE,
    "location" TEXT,
    "headline" TEXT,
    "is_open_to_work" BOOLEAN NOT NULL DEFAULT false,
    "profile_image_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_public_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "profiles_private" (
    "user_id" UUID NOT NULL,
    "phone_number" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_private_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "profile_language" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "proficiency" "language_proficiency" NOT NULL,
    "test_name" TEXT,
    "test_score" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profile_language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_career" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "position_title" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "employment_type" "employment_type" NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "description" TEXT,
    "experience_level" "experience_level",
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profile_career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_education" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "institution_name" TEXT NOT NULL,
    "education_type" "education_type_vn" NOT NULL,
    "field" TEXT,
    "graduation_status" "graduation_status" NOT NULL DEFAULT 'ENROLLED',
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profile_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_url" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profile_url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_attachment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "label" TEXT,
    "file_type" "attachment_type" NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "s3_bucket" TEXT NOT NULL,
    "s3_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profile_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_family" (
    "id" TEXT NOT NULL,
    "display_name_en" TEXT NOT NULL,
    "display_name_ko" TEXT,
    "display_name_vi" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "job_family_id" TEXT NOT NULL,
    "display_name_en" TEXT NOT NULL,
    "display_name_ko" TEXT,
    "display_name_vi" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" TEXT NOT NULL,
    "display_name_en" TEXT NOT NULL,
    "display_name_ko" TEXT,
    "display_name_vi" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_alias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "skill_id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "alias_normalized" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "skill_alias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_skill" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "skill_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profile_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_description" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "org_id" UUID,
    "job_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "job_posting_status" NOT NULL DEFAULT 'recruiting',
    "employment_type" "employment_type" NOT NULL,
    "work_arrangement" "work_arrangement" NOT NULL,
    "min_years_experience" INTEGER,
    "min_education" "education_type_vn",
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "salary_currency" CHAR(3) NOT NULL DEFAULT 'VND',
    "salary_period" "salary_period" NOT NULL DEFAULT 'year',
    "salary_is_negotiable" BOOLEAN NOT NULL DEFAULT false,
    "description_markdown" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_description_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_description_skill" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "jd_id" UUID NOT NULL,
    "skill_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_description_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apply" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "jd_id" UUID NOT NULL,
    "status" "apply_status" NOT NULL DEFAULT 'applied',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "apply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_certification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT,
    "institution_name" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profile_certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "app_users_org_idx" ON "app_users"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_public_public_slug_key" ON "profiles_public"("public_slug");

-- CreateIndex
CREATE INDEX "profile_language_user_idx" ON "profile_language"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_language_user_id_language_key" ON "profile_language"("user_id", "language");

-- CreateIndex
CREATE INDEX "profile_career_user_idx" ON "profile_career"("user_id");

-- CreateIndex
CREATE INDEX "profile_career_job_idx" ON "profile_career"("job_id");

-- CreateIndex
CREATE INDEX "profile_education_user_idx" ON "profile_education"("user_id");

-- CreateIndex
CREATE INDEX "profile_url_user_idx" ON "profile_url"("user_id");

-- CreateIndex
CREATE INDEX "profile_attachment_user_idx" ON "profile_attachment"("user_id");

-- CreateIndex
CREATE INDEX "job_family_idx" ON "job"("job_family_id");

-- CreateIndex
CREATE INDEX "skill_alias_norm_idx" ON "skill_alias"("alias_normalized");

-- CreateIndex
CREATE INDEX "skill_alias_skill_idx" ON "skill_alias"("skill_id");

-- CreateIndex
CREATE INDEX "profile_skill_user_idx" ON "profile_skill"("user_id");

-- CreateIndex
CREATE INDEX "profile_skill_skill_idx" ON "profile_skill"("skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_skill_user_id_skill_id_key" ON "profile_skill"("user_id", "skill_id");

-- CreateIndex
CREATE INDEX "jd_org_idx" ON "job_description"("org_id");

-- CreateIndex
CREATE INDEX "jd_job_idx" ON "job_description"("job_id");

-- CreateIndex
CREATE INDEX "jd_skill_jd_idx" ON "job_description_skill"("jd_id");

-- CreateIndex
CREATE INDEX "jd_skill_skill_idx" ON "job_description_skill"("skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_description_skill_jd_id_skill_id_key" ON "job_description_skill"("jd_id", "skill_id");

-- CreateIndex
CREATE INDEX "apply_user_idx" ON "apply"("user_id");

-- CreateIndex
CREATE INDEX "apply_jd_idx" ON "apply"("jd_id");

-- CreateIndex
CREATE UNIQUE INDEX "apply_user_id_jd_id_key" ON "apply"("user_id", "jd_id");

-- CreateIndex
CREATE INDEX "profile_certification_user_idx" ON "profile_certification"("user_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_users" ADD CONSTRAINT "app_users_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_users" ADD CONSTRAINT "app_users_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles_public" ADD CONSTRAINT "profiles_public_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles_private" ADD CONSTRAINT "profiles_private_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_language" ADD CONSTRAINT "profile_language_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_career" ADD CONSTRAINT "profile_career_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_career" ADD CONSTRAINT "profile_career_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_education" ADD CONSTRAINT "profile_education_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_url" ADD CONSTRAINT "profile_url_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_attachment" ADD CONSTRAINT "profile_attachment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_job_family_id_fkey" FOREIGN KEY ("job_family_id") REFERENCES "job_family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_alias" ADD CONSTRAINT "skill_alias_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_skill" ADD CONSTRAINT "profile_skill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_skill" ADD CONSTRAINT "profile_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_description" ADD CONSTRAINT "job_description_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_description" ADD CONSTRAINT "job_description_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_description_skill" ADD CONSTRAINT "job_description_skill_jd_id_fkey" FOREIGN KEY ("jd_id") REFERENCES "job_description"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_description_skill" ADD CONSTRAINT "job_description_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply" ADD CONSTRAINT "apply_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apply" ADD CONSTRAINT "apply_jd_id_fkey" FOREIGN KEY ("jd_id") REFERENCES "job_description"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_certification" ADD CONSTRAINT "profile_certification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
