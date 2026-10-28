import type {ReactNode} from 'react';

export interface ApiRow {
  name: string;
  type: string;
  /** Valeur par défaut, ou "requis" */
  default?: string;
  description: ReactNode;
}

/** Tableau d'options d'une primitive. */
export default function ApiTable({rows}: {rows: ApiRow[]}) {
  return (
    <div className="wide overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th scope="col">Option</th>
            <th scope="col">Type</th>
            <th scope="col">Défaut</th>
            <th scope="col">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="whitespace-nowrap">
                <code>{row.name}</code>
              </td>
              <td>
                <code>{row.type}</code>
              </td>
              <td className="whitespace-nowrap">{row.default ?? '—'}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
