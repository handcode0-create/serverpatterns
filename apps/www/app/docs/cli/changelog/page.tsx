import {redirect} from 'next/navigation';

// Ancienne adresse conservée pour ne pas casser les liens existants.
export default function Redirect() {
  redirect('/docs/changelog');
}
