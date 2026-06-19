import OpenAI from 'openai';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

export type GenerateInput = {
  userId: string;
  academicFieldSlug: string;
  researchModuleSlug: string;
  input: Record<string, unknown>;
  projectId?: string;
};

function interpolate(template: string, input: Record<string, unknown>) {
  return template.replace('{{input}}', JSON.stringify(input, null, 2));
}

export async function generateContent(args: GenerateInput) {
  const field = await prisma.academicField.findUnique({ where: { slug: args.academicFieldSlug } });
  const module = await prisma.researchModule.findUnique({ where: { slug: args.researchModuleSlug } });
  if (!field || !module) throw new AppError('Academic field or research module not found', 404);

  const template = await prisma.researchTemplate.findUnique({
    where: { academicFieldId_researchModuleId: { academicFieldId: field.id, researchModuleId: module.id } }
  });
  if (!template?.isActive) throw new AppError('No active template found for this field/module pair', 404);

  const prompt = interpolate(template.userPrompt, args.input);
  let content = '';
  let status: 'SUCCESS' | 'FAILED' = 'SUCCESS';
  let errorMessage: string | undefined;

  try {
    if (env.AI_PROVIDER === 'mock') {
      content = mockContent(field.name, module.name, args.input);
    } else {
      if (!env.AI_API_KEY) throw new AppError('AI_API_KEY is not configured', 503);
      const client = new OpenAI({ apiKey: env.AI_API_KEY, baseURL: env.AI_BASE_URL });
      const response = await client.chat.completions.create({
        model: env.AI_MODEL,
        temperature: template.temperature,
        messages: [
          { role: 'system', content: template.systemPrompt },
          { role: 'user', content: prompt }
        ]
      });
      content = response.choices[0]?.message.content || 'No content generated.';
    }
  } catch (error) {
    status = 'FAILED';
    errorMessage = error instanceof Error ? error.message : 'AI request failed';
    throw new AppError(errorMessage, 503);
  } finally {
    await prisma.aIRequest.create({
      data: { userId: args.userId, provider: env.AI_PROVIDER, model: env.AI_MODEL, academicFieldId: field.id, researchModuleId: module.id, status, errorMessage }
    }).catch(() => undefined);
  }

  const generated = await prisma.generatedContent.create({
    data: {
      userId: args.userId,
      academicFieldId: field.id,
      researchModuleId: module.id,
      projectId: args.projectId,
      title: `${field.name} ${module.name}`,
      input: args.input,
      content
    }
  });

  return generated;
}

function mockContent(field: string, module: string, input: Record<string, unknown>) {
  return `# ${field} — ${module}\n\nThis is mock AI output for safe free-tier testing.\n\n## Student Input\n\n\`\`\`json\n${JSON.stringify(input, null, 2)}\n\`\`\`\n\n## Generated Guidance\n\n- Define a clear academic problem.\n- Identify the target users and research context.\n- Select a feasible technology stack.\n- Describe the methodology and expected contribution.\n- Keep the scope realistic for a student project.\n\n## Next Steps\n\n1. Refine the topic into a measurable research question.\n2. Search recent academic sources using Google Scholar or your library database.\n3. Convert the idea into objectives, scope, and methodology sections.`;
}
