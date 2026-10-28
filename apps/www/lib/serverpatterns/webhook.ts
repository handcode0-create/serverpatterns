import { Result, ok, err } from './types';

export interface WebhookHandlerOptions<TVerified = any, TResponse = any> {
  /**
   * Nom de l'en-tête contenant la signature (ex: 'stripe-signature', 'x-signature')
   */
  signatureHeader: string;

  /**
   * Le secret du webhook ou une fonction (synchrone ou asynchrone) retournant ce secret.
   * Utile pour récupérer dynamiquement le secret depuis des variables d'environnement ou une base de données.
   */
  secret: string | (() => string | Promise<string>);

  /**
   * Fonction de validation de la signature.
   * Reçoit le corps brut de la requête, la signature de l'en-tête et le secret résolu.
   * Peut retourner un booléen simple, une promesse de booléen ou une Monade Result (contenant l'événement typé).
   */
  verify: (
    rawBody: string,
    signature: string,
    secret: string
  ) => boolean | Promise<boolean> | Result<TVerified, Error> | Promise<Result<TVerified, Error>>;

  /**
   * Logique métier exécutée après validation de la signature.
   * Reçoit le corps brut, le corps parsé en JSON (si applicable) et l'événement retourné par `verify`.
   */
  handler: (args: {
    rawBody: string;
    body: any;
    verifiedEvent?: TVerified;
    req: Request;
  }) => Promise<{ status: number; body: TResponse } | Response>;

  /**
   * Intercepteur optionnel d'erreurs (signature invalide, erreur de parsing, etc.)
   */
  onError?: (error: Error) => Promise<{ status: number; body: any } | Response>;
}

/**
 * Wrapper de Route Handler Next.js pour gérer de manière sécurisée la réception de Webhooks.
 * Gère automatiquement la lecture du buffer brut (raw body), l'extraction des signatures et la validation.
 */
export function createWebhookHandler<TVerified = any, TResponse = any>(
  options: WebhookHandlerOptions<TVerified, TResponse>
): (req: Request) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    try {
      // 1. Extraction de la signature
      const signature = req.headers.get(options.signatureHeader);
      if (!signature) {
        throw new Error(`En-tête de signature "${options.signatureHeader}" manquant.`);
      }

      // 2. Résolution du secret
      const secret = typeof options.secret === 'function' ? await options.secret() : options.secret;
      if (!secret) {
        throw new Error('Le secret de validation du webhook est vide ou non configuré.');
      }

      // 3. Lecture du corps de la requête sous forme brute (raw text) pour la signature
      let rawBody: string;
      try {
        rawBody = await req.text();
      } catch (e: any) {
        throw new Error(`Impossible de lire le corps brut de la requête : ${e?.message || e}`);
      }

      // 4. Validation de la signature
      let isVerified = false;
      let verifiedEvent: TVerified | undefined;

      const verificationResult = await options.verify(rawBody, signature, secret);

      if (typeof verificationResult === 'boolean') {
        isVerified = verificationResult;
      } else {
        // C'est un Result<T, E>
        if (verificationResult.ok) {
          isVerified = true;
          verifiedEvent = verificationResult.value;
        } else {
          isVerified = false;
          throw verificationResult.error;
        }
      }

      if (!isVerified) {
        throw new Error('La vérification de la signature du webhook a échoué.');
      }

      // 5. Tentative de parsing JSON du body pour confort d'usage dans le handler
      let body: any = {};
      try {
        if (rawBody) {
          body = JSON.parse(rawBody);
        }
      } catch {
        // Pas un JSON valide, on laisse body vide ou on passe rawBody. Le handler saura gérer.
      }

      // 6. Exécution du handler principal
      const response = await options.handler({
        rawBody,
        body,
        verifiedEvent,
        req,
      });

      // 7. Retour de la réponse Web standard
      if (response instanceof Response) {
        return response;
      }

      return new Response(JSON.stringify(response.body), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));

      if (options.onError) {
        const errorResponse = await options.onError(error);
        if (errorResponse instanceof Response) {
          return errorResponse;
        }
        return new Response(JSON.stringify(errorResponse.body), {
          status: errorResponse.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Retour par défaut en cas d'erreur de sécurité ou de serveur
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        {
          status: error.message.includes('signature') || error.message.includes('Vérification') ? 401 : 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

/**
 * Utilitaire natif standard pour valider des signatures HMAC-SHA256 (Web Crypto API).
 * Fonctionne parfaitement sur Edge (Vercel Edge, Cloudflare Workers) et Node.js.
 */
export async function verifyHmacSha256Signature(
  rawBody: string,
  signature: string,
  secret: string,
  encoding: 'hex' | 'base64' = 'hex'
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(rawBody);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify', 'sign']
    );

    let signatureBuffer: ArrayBuffer;
    if (encoding === 'hex') {
      const hexLen = signature.length;
      const arr = new Uint8Array(hexLen / 2);
      for (let i = 0; i < hexLen; i += 2) {
        arr[i / 2] = parseInt(signature.substring(i, i + 2), 16);
      }
      signatureBuffer = arr.buffer;
    } else {
      // Base64 (ex: pour Lemonsqueezy ou autre)
      const binaryString = atob(signature);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      signatureBuffer = bytes.buffer;
    }

    return await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      signatureBuffer,
      messageData
    );
  } catch {
    return false;
  }
}
