import type {Metadata} from 'next';
import DocPage from '@/components/DocPage';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'Signatures webhook',
  description: 'verifyHmacSignature et verifyTimestampedHmacSignature pour Wave, Stripe, GitHub.',
};

export default function WebhookPage() {
  return (
    <DocPage
      href="/docs/primitives/webhook"
      source="app/docs/primitives/webhook/page.tsx"
      title="Signatures webhook"
      lead="Avant de traiter un webhook de paiement, vérifie qu’il vient bien du fournisseur. Deux fonctions vérifient une signature HMAC-SHA256 : tu les appelles toi-même dans un Route Handler."
    >
      <h2>verifyTimestampedHmacSignature</h2>
      <p>
        Pour les en-têtes au format <code>t=&lt;horodatage&gt;,v1=&lt;signature&gt;</code>, utilisé par Wave et Stripe.
        Elle refuse aussi les messages trop anciens (protection contre le rejeu).
      </p>
      <ApiTable
        rows={[
          {name: 'rawBody', type: 'string', default: 'requis', description: 'Le corps brut, lu avec request.text().'},
          {name: 'signatureHeader', type: 'string | null', default: 'requis', description: 'La valeur de l’en-tête de signature.'},
          {name: 'secret', type: 'string', default: 'requis', description: 'Le secret partagé avec le fournisseur, depuis une variable d’environnement.'},
          {name: 'toleranceSeconds', type: 'number', default: '300', description: 'Âge maximal accepté du message, en secondes.'},
          {
            name: 'payloadSeparator',
            type: 'string',
            default: '""',
            description: (
              <>
                Séparateur entre horodatage et corps dans le message signé : <code>&quot;&quot;</code> pour Wave,{' '}
                <code>&quot;.&quot;</code> pour Stripe.
              </>
            ),
          },
          {name: 'timestampKey · signatureKey', type: 'string', default: '"t" · "v1"', description: 'Noms des clés dans l’en-tête.'},
        ]}
      />
      <p>
        Elle renvoie <code>{'{ valid: boolean; reason?: string }'}</code>. Si l’en-tête contient plusieurs signatures{' '}
        <code>v1</code> (pendant une rotation de secret), une seule valide suffit.
      </p>

      <h3>Wave</h3>
      <Example file="webhook/app/api/webhooks/wave/route.ts" />

      <h3>Stripe</h3>
      <Example file="webhook/app/api/webhooks/stripe/route.ts" />
      <Callout title="Sans payloadSeparator, Stripe échoue" type="warning">
        Stripe signe <code>horodatage.corps</code>, avec un point. Sans <code>payloadSeparator: &quot;.&quot;</code>,
        toutes les signatures Stripe sont refusées.
      </Callout>

      <h2>verifyHmacSignature</h2>
      <p>
        La version bas niveau, sans horodatage. Par défaut, l’en-tête contient la signature hexadécimale du corps brut.{' '}
        <code>extractSignature</code> et <code>buildSignedMessage</code> s’adaptent aux autres formats.
      </p>
      <Example file="webhook/app/api/webhooks/github/route.ts" />

      <h2>Points d’attention</h2>
      <ul>
        <li>
          <strong>Lis le corps brut</strong> avec <code>request.text()</code>. Un JSON parsé puis re-sérialisé ne donne
          pas forcément les mêmes octets, et la signature échoue.
        </li>
        <li>
          <strong>Runtime Node.js uniquement.</strong> La vérification utilise <code>node:crypto</code> : elle ne
          fonctionne pas sur le runtime Edge. Next.js utilise le runtime Node.js par défaut ;{' '}
          <code>export const runtime = &quot;nodejs&quot;</code> le rend explicite.
        </li>
        <li>
          <strong>La comparaison est à temps constant</strong> (<code>timingSafeEqual</code>), pour ne pas révéler la
          signature attendue par mesure du temps de réponse.
        </li>
      </ul>
    </DocPage>
  );
}
