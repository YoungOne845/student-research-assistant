export type User = { id: string; name: string; email: string; role: string; avatarUrl?: string; preferredFieldId?: string };
export type Field = { id: string; name: string; slug: string; description: string };
export type Module = { id: string; name: string; slug: string; description: string };
export type Project = { id: string; title: string; description: string; tags: string[]; status: string; updatedAt: string };
