'use client';

import { adminApi, type AdminProgram } from '../../../lib/admin-api';
import { ProgramForm } from './ProgramForm';

export function EditProgramClient({ program }: { program: AdminProgram }) {
  async function handleUpdate(data: { name: string; abbreviation: string; description: string }) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.programs.update(token, program.id, data);
  }

  return <ProgramForm initial={program} onSubmit={handleUpdate} submitLabel="Save Changes" />;
}
