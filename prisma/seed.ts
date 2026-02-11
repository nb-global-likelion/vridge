import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { readFileSync } from 'fs'
import { join } from 'path'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

interface JobSeed {
  id: string
  displayNameEn: string
  displayNameKo?: string
  displayNameVi?: string
  sortOrder: number
}

interface JobFamilySeed {
  id: string
  displayNameEn: string
  displayNameKo?: string
  displayNameVi?: string
  sortOrder: number
  jobs: JobSeed[]
}

interface SkillSeed {
  id: string
  displayNameEn: string
  displayNameKo?: string
  displayNameVi?: string
  aliases: string[]
}

function loadJson<T>(filename: string): T {
  const path = join(__dirname, 'seed-data', filename)
  return JSON.parse(readFileSync(path, 'utf-8'))
}

async function seedJobFamilies() {
  const families = loadJson<JobFamilySeed[]>('job-families.json')

  for (const family of families) {
    const { jobs, ...familyData } = family
    await prisma.jobFamily.upsert({
      where: { id: familyData.id },
      update: {
        displayNameEn: familyData.displayNameEn,
        displayNameKo: familyData.displayNameKo,
        displayNameVi: familyData.displayNameVi,
        sortOrder: familyData.sortOrder,
      },
      create: familyData,
    })

    for (const job of jobs) {
      await prisma.job.upsert({
        where: { id: job.id },
        update: {
          displayNameEn: job.displayNameEn,
          displayNameKo: job.displayNameKo,
          displayNameVi: job.displayNameVi,
          sortOrder: job.sortOrder,
          jobFamilyId: familyData.id,
        },
        create: {
          ...job,
          jobFamilyId: familyData.id,
        },
      })
    }
  }

  console.log(`시드 완료: ${families.length} families, ${families.reduce((sum, f) => sum + f.jobs.length, 0)} jobs`)
}

async function seedSkills() {
  const skills = loadJson<SkillSeed[]>('skills.json')

  for (const skill of skills) {
    const { aliases, ...skillData } = skill
    await prisma.skill.upsert({
      where: { id: skillData.id },
      update: {
        displayNameEn: skillData.displayNameEn,
        displayNameKo: skillData.displayNameKo ?? null,
        displayNameVi: skillData.displayNameVi ?? null,
      },
      create: {
        id: skillData.id,
        displayNameEn: skillData.displayNameEn,
        displayNameKo: skillData.displayNameKo ?? null,
        displayNameVi: skillData.displayNameVi ?? null,
      },
    })

    for (const alias of aliases) {
      const normalized = alias.toLowerCase().trim()
      const existing = await prisma.skillAlias.findFirst({
        where: { skillId: skillData.id, aliasNormalized: normalized },
      })
      if (!existing) {
        await prisma.skillAlias.create({
          data: {
            skillId: skillData.id,
            alias,
            aliasNormalized: normalized,
          },
        })
      }
    }
  }

  const aliasCount = skills.reduce((sum, s) => sum + s.aliases.length, 0)
  console.log(`시드 완료: ${skills.length} skills, ${aliasCount} aliases`)
}

async function main() {
  await seedJobFamilies()
  await seedSkills()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
