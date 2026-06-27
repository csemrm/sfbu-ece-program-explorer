import type { RequirementGroup } from '../../lib/api';

interface Props {
  groups: RequirementGroup[];
  academicYear: string;
}

export function RequirementSummary({ groups, academicYear }: Props) {
  const totalMin = groups.reduce((sum, g) => sum + (g.minCredits ?? 0), 0);

  return (
    <section aria-labelledby="req-heading">
      <div className="flex items-baseline justify-between mb-4">
        <h2 id="req-heading" className="text-xl font-bold text-gray-900">
          Degree Requirements
        </h2>
        <span className="text-sm text-gray-500">Catalog Year {academicYear}</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 font-semibold text-gray-700">Requirement Group</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                Description
              </th>
              <th className="text-right px-5 py-3 font-semibold text-gray-700">Min Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {groups.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-medium text-gray-900">{g.name}</td>
                <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                  {g.description ?? '—'}
                </td>
                <td className="px-5 py-4 text-right font-semibold text-gray-800">
                  {g.minCredits ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
          {totalMin > 0 && (
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="px-5 py-3 font-bold text-gray-900" colSpan={2}>
                  Total Minimum Credits
                </td>
                <td className="px-5 py-3 text-right font-bold text-blue-700 text-base">
                  {totalMin}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
}
