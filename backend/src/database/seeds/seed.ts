import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { DataSource, IsNull } from 'typeorm';
import { AppDataSource } from '../data-source';
import {
  CATALOG_IMPORT_STATUS,
  COREQUISITES,
  COURSE_KNOWLEDGE_AREAS,
  COURSE_OFFERINGS,
  COURSES,
  KNOWLEDGE_AREAS,
  PREREQUISITES,
  PROGRAMS,
} from './catalog-data';
import { AcademicTerm } from '../entities/academic-term.entity';
import { CatalogImport } from '../entities/catalog-import.entity';
import { CatalogYear } from '../entities/catalog-year.entity';
import { Corequisite } from '../entities/corequisite.entity';
import { Course } from '../entities/course.entity';
import { CourseKnowledgeArea } from '../entities/course-knowledge-area.entity';
import { CourseOffering } from '../entities/course-offering.entity';
import { KnowledgeArea } from '../entities/knowledge-area.entity';
import { Prerequisite } from '../entities/prerequisite.entity';
import { Program } from '../entities/program.entity';
import { ProgramRequirement } from '../entities/program-requirement.entity';
import { RequirementGroup } from '../entities/requirement-group.entity';
import { AdminUser, AdminRole } from '../entities/admin-user.entity';

dotenv.config();

async function seed(dataSource: DataSource): Promise<void> {
  console.log('Seeding database...');

  // ── Courses ────────────────────────────────────────────────
  console.log(`  Upserting ${COURSES.length} courses...`);
  const courseRepo = dataSource.getRepository(Course);
  const courseMap = new Map<string, string>(); // code → id

  for (const c of COURSES) {
    let course = await courseRepo.findOne({
      where: { courseCode: c.courseCode },
    });
    if (!course) {
      course = courseRepo.create(c);
      await courseRepo.save(course);
    } else {
      await courseRepo.update(course.id, c);
    }
    courseMap.set(c.courseCode, course.id);
  }

  // ── Prerequisites ──────────────────────────────────────────
  console.log(`  Upserting ${PREREQUISITES.length} prerequisites...`);
  const prereqRepo = dataSource.getRepository(Prerequisite);
  for (const p of PREREQUISITES) {
    const courseId = courseMap.get(p.courseCode);
    const prereqId = courseMap.get(p.prerequisiteCode);
    if (!courseId || !prereqId) {
      console.warn(
        `    Skipping prereq ${p.prerequisiteCode} → ${p.courseCode}: course not found`,
      );
      continue;
    }
    const exists = await prereqRepo.findOne({
      where: { courseId, prerequisiteCourseId: prereqId },
    });
    if (!exists) {
      await prereqRepo.save(
        prereqRepo.create({ courseId, prerequisiteCourseId: prereqId }),
      );
    }
  }

  // ── Corequisites ───────────────────────────────────────────
  console.log(`  Upserting ${COREQUISITES.length} corequisites...`);
  const coreqRepo = dataSource.getRepository(Corequisite);
  for (const c of COREQUISITES) {
    const courseId = courseMap.get(c.courseCode);
    const coreqId = courseMap.get(c.corequisiteCode);
    if (!courseId || !coreqId) {
      console.warn(
        `    Skipping coreq ${c.corequisiteCode} → ${c.courseCode}: course not found`,
      );
      continue;
    }
    const exists = await coreqRepo.findOne({
      where: { courseId, corequisiteCourseId: coreqId },
    });
    if (!exists) {
      await coreqRepo.save(
        coreqRepo.create({ courseId, corequisiteCourseId: coreqId }),
      );
    }
  }

  // ── Knowledge Areas ────────────────────────────────────────
  console.log(`  Upserting ${KNOWLEDGE_AREAS.length} knowledge areas...`);
  const kaRepo = dataSource.getRepository(KnowledgeArea);
  const kaMap = new Map<string, string>(); // name → id

  for (const ka of KNOWLEDGE_AREAS) {
    let area = await kaRepo.findOne({ where: { name: ka.name } });
    if (!area) {
      area = kaRepo.create({ name: ka.name, description: ka.description });
      await kaRepo.save(area);
    } else {
      await kaRepo.update(area.id, { description: ka.description });
    }
    kaMap.set(ka.name, area.id);
  }

  // ── Course ↔ Knowledge Area ────────────────────────────────
  console.log(
    `  Upserting knowledge-area mappings for ${COURSE_KNOWLEDGE_AREAS.length} courses...`,
  );
  const ckaRepo = dataSource.getRepository(CourseKnowledgeArea);
  for (const mapping of COURSE_KNOWLEDGE_AREAS) {
    const courseId = courseMap.get(mapping.courseCode);
    if (!courseId) {
      console.warn(
        `    Skipping knowledge areas for unknown course: ${mapping.courseCode}`,
      );
      continue;
    }
    for (const areaName of mapping.knowledgeAreaNames) {
      const knowledgeAreaId = kaMap.get(areaName);
      if (!knowledgeAreaId) {
        console.warn(
          `    Skipping unknown knowledge area "${areaName}" for ${mapping.courseCode}`,
        );
        continue;
      }
      const exists = await ckaRepo.findOne({
        where: { courseId, knowledgeAreaId },
      });
      if (!exists) {
        await ckaRepo.save(ckaRepo.create({ courseId, knowledgeAreaId }));
      }
    }
  }

  // ── Course Offerings ───────────────────────────────────────
  console.log(`  Upserting offerings for ${COURSE_OFFERINGS.length} terms...`);
  const termRepo = dataSource.getRepository(AcademicTerm);
  const offeringRepo = dataSource.getRepository(CourseOffering);
  for (const seed of COURSE_OFFERINGS) {
    // Terms come from the CourseOfferings migration, not from this seeder —
    // if one is missing the environment is out of date, so say so loudly
    // instead of silently creating a term the migration did not define.
    const term = await termRepo.findOne({ where: { name: seed.termName } });
    if (!term) {
      console.warn(
        `    Skipping offerings for unknown academic term: ${seed.termName}`,
      );
      continue;
    }
    for (const courseCode of seed.courseCodes) {
      const courseId = courseMap.get(courseCode);
      if (!courseId) {
        console.warn(
          `    Skipping offering for unknown course: ${courseCode} (${seed.termName})`,
        );
        continue;
      }
      const exists = await offeringRepo.findOne({
        where: { termId: term.id, courseId },
      });
      if (!exists) {
        await offeringRepo.save(
          offeringRepo.create({ termId: term.id, courseId }),
        );
      }
    }
  }

  // ── Programs, CatalogYears, RequirementGroups, ProgramRequirements ──
  const programRepo = dataSource.getRepository(Program);
  const cyRepo = dataSource.getRepository(CatalogYear);
  const rgRepo = dataSource.getRepository(RequirementGroup);
  const prRepo = dataSource.getRepository(ProgramRequirement);
  const ciRepo = dataSource.getRepository(CatalogImport);

  for (const ps of PROGRAMS) {
    console.log(`  Seeding program: ${ps.abbreviation}...`);

    let program = await programRepo.findOne({
      where: { abbreviation: ps.abbreviation },
    });
    if (!program) {
      program = programRepo.create({
        name: ps.name,
        abbreviation: ps.abbreviation,
        description: ps.description,
      });
      await programRepo.save(program);
    }

    let catalogYear = await cyRepo.findOne({
      where: { programId: program.id, academicYear: ps.academicYear },
    });
    if (!catalogYear) {
      catalogYear = cyRepo.create({
        programId: program.id,
        academicYear: ps.academicYear,
        effectiveDate: ps.effectiveDate,
      });
      await cyRepo.save(catalogYear);
    }

    for (const rgs of ps.requirementGroups) {
      let rg = await rgRepo.findOne({
        where: { catalogYearId: catalogYear.id, name: rgs.name },
      });
      if (!rg) {
        rg = rgRepo.create({
          catalogYearId: catalogYear.id,
          name: rgs.name,
          description: rgs.description,
          minCredits: rgs.minCredits,
          sortOrder: rgs.sortOrder,
        });
        await rgRepo.save(rg);
      } else {
        // Existing groups were created but never refreshed, so inserting a group
        // in the middle of a program left the older ones on their original
        // sortOrder and the sequence interleaved. Update in place, as courses do.
        await rgRepo.update(rg.id, {
          description: rgs.description,
          minCredits: rgs.minCredits,
          sortOrder: rgs.sortOrder,
        });
      }

      let sortOrder = 1;
      for (const req of rgs.requirements) {
        const courseId = req.courseCode
          ? (courseMap.get(req.courseCode) ?? null)
          : null;
        if (req.courseCode && !courseId) {
          console.warn(
            `    Skipping requirement for unknown course: ${req.courseCode}`,
          );
          continue;
        }
        // A placeholder requirement carries no course, so matching on courseId
        // alone never finds it and every reseed inserted another copy. Fall back
        // to matching the description within the group.
        const exists = courseId
          ? await prRepo.findOne({
              where: { requirementGroupId: rg.id, courseId },
            })
          : await prRepo.findOne({
              where: {
                requirementGroupId: rg.id,
                courseId: IsNull(),
                description: req.description ?? IsNull(),
              },
            });
        if (!exists) {
          await prRepo.save(
            prRepo.create({
              requirementGroupId: rg.id,
              courseId: courseId ?? null,
              minCredits: req.minCredits,
              description: req.description,
              sortOrder: sortOrder++,
            }),
          );
        }
      }
    }

    // CatalogImport record
    const existingImport = await ciRepo.findOne({
      where: { catalogYearId: catalogYear.id },
    });
    if (!existingImport) {
      await ciRepo.save(
        ciRepo.create({
          catalogYearId: catalogYear.id,
          importedAt: new Date(),
          sourceFile: 'sfbu-2025-2026-university-catalog-10.27.pdf',
          status: CATALOG_IMPORT_STATUS,
        }),
      );
    }
  }

  // ── Admin user ─────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? 'admin@sfbu.edu';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? 'SfbuAdmin2025!';
  const adminRepo = dataSource.getRepository(AdminUser);
  const existingAdmin = await adminRepo.findOne({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await adminRepo.save(
      adminRepo.create({
        email: adminEmail,
        passwordHash,
        role: AdminRole.SYSTEM_ADMIN,
        isActive: true,
      }),
    );
    console.log(
      `  Admin user created: ${adminEmail} (change password after first login)`,
    );
  } else {
    console.log(`  Admin user already exists: ${adminEmail}`);
  }

  console.log('Seed complete.');
}

async function main(): Promise<void> {
  await AppDataSource.initialize();
  try {
    await seed(AppDataSource);
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
