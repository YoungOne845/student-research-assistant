import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const modules = [
  ['Project Idea Generator','project-idea-generator','Generate feasible Computer Science project ideas.'],
  ['Thesis Topic Generator','thesis-topic-generator','Generate strong thesis topics.'],
  ['Problem Statement Generator','problem-statement-generator','Create formal research problem statements.'],
  ['Research Objective Generator','research-objective-generator','Generate general and specific objectives.'],
  ['Scope Generator','scope-generator','Define scope and limitations.'],
  ['Methodology Generator','methodology-generator','Suggest methodology and tools.'],
  ['Research Gap Finder','research-gap-finder','Identify possible research gaps.'],
  ['Literature Review Assistant','literature-review-assistant','Structure and draft literature review sections.'],
  ['Questionnaire Generator','questionnaire-generator','Generate research questionnaires.'],
  ['Survey Generator','survey-generator','Generate survey structures.'],
  ['Proposal Generator','proposal-generator','Generate proposal drafts.'],
  ['Research Assistant Chat','research-assistant-chat','Chat-based research guidance.']
] as const;

const promptFor = (moduleName: string) => ({
  title: `Computer Science ${moduleName}`,
  systemPrompt: `You are Student Research Assistant, a rigorous academic helper for Computer Science students. Produce structured, practical, ethical, plagiarism-aware research support. Never fabricate citations. When citations are needed, suggest search keywords and source types instead of inventing references.`,
  userPrompt: `Academic Field: Computer Science\nResearch Module: ${moduleName}\nStudent input:\n{{input}}\n\nGenerate a polished, useful academic response with headings, bullet points where helpful, and practical next steps.`
});

async function main() {
  const cs = await prisma.academicField.upsert({
    where: { slug: 'computer-science' },
    update: {},
    create: {
      name: 'Computer Science',
      slug: 'computer-science',
      description: 'Research and software project support for Computer Science students.'
    }
  });

  for (let i = 0; i < modules.length; i++) {
    const [name, slug, description] = modules[i];
    const module = await prisma.researchModule.upsert({
      where: { slug },
      update: { name, description, orderIndex: i + 1, isActive: true },
      create: { name, slug, description, orderIndex: i + 1 }
    });

    await prisma.academicFieldModule.upsert({
      where: { academicFieldId_researchModuleId: { academicFieldId: cs.id, researchModuleId: module.id } },
      update: { enabled: true },
      create: { academicFieldId: cs.id, researchModuleId: module.id, enabled: true }
    });

    const prompt = promptFor(name);
    await prisma.researchTemplate.upsert({
      where: { academicFieldId_researchModuleId: { academicFieldId: cs.id, researchModuleId: module.id } },
      update: prompt,
      create: { academicFieldId: cs.id, researchModuleId: module.id, ...prompt }
    });
  }

  console.log('Seed complete: Computer Science field, modules, and templates are ready.');
}

main().finally(async () => prisma.$disconnect());
