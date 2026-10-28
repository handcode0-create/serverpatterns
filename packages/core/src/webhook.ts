/**
 * Primitive générique de vérification de signature webhook — HMAC-SHA256
 * par défaut (le standard le plus courant : Wave, Stripe, GitHub, CinetPay
 * utilisent tous une variante de ce mécanisme). ServerPatterns ne code pas
 * un client par provider : cette primitive te donne le bloc de construction,
 * à toi d'adapter le format exact du header selon le provider (voir les
 * options `extractSignature`, `buildSignedMessage` et `payloadSeparator`).
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export interface VerifyHmacSignatureOptions {
  /** Corps brut de la requête (jamais le JSON re-sérialisé) */
  rawBody: string;
  /** Valeur brute du header de signature envoyé par le provider */
  signatureHeader: string | null;
  /** Secret partagé avec le provider (jamais commité, toujours en variable d'env) */
  secret: string;
  /**
   * Comment extraire la signature attendue du header et reconstruire le
   * message signé. Par défaut : header = signature hexadécimale brute,
   * message signé = rawBody seul (cas simple, ex: GitHub `X-Hub-Signature-256`
   * sans préfixe "sha256=" une fois extrait).
   */
  extractSignature?: (header: string) => string;
  /** Message réellement signé par le provider (par défaut: rawBody seul) */
  buildSignedMessage?: (rawBody: string, header: string) => string;
}

export interface VerificationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Vérifie une signature HMAC-SHA256 générique. Fonction bas niveau : pour
 * un cas standard "timestamp,signature" (comme Wave ou Stripe), utilise
 * plutôt `verifyTimestampedHmacSignature` ci-dessous qui gère le format
 * courant directement.
 *
 * @example
 * const result = verifyHmacSignature({
 *   rawBody,
 *   signatureHeader: request.headers.get("X-Signature"),
 *   secret: process.env.WEBHOOK_SECRET!,
 * });
 */
export function verifyHmacSignature(options: VerifyHmacSignatureOptions): VerificationResult {
  const { rawBody, signatureHeader, secret } = options;

  if (!signatureHeader) {
    return { valid: false, reason: "Header de signature manquant" };
  }

  const receivedSignature = options.extractSignature
    ? options.extractSignature(signatureHeader)
    : signatureHeader;

  const signedMessage = options.buildSignedMessage
    ? options.buildSignedMessage(rawBody, signatureHeader)
    : rawBody;

  const expectedSignature = createHmac("sha256", secret).update(signedMessage).digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const receivedBuffer = Buffer.from(receivedSignature, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return { valid: false, reason: "Signature invalide" };
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer)
    ? { valid: true }
    : { valid: false, reason: "Signature invalide" };
}

export interface VerifyTimestampedHmacOptions {
  rawBody: string;
  /** Header au format "t=<timestamp>,v1=<signature>" (Wave, Stripe et beaucoup d'autres) */
  signatureHeader: string | null;
  secret: string;
  /** Tolérance en secondes contre les attaques par rejeu (défaut: 300 = 5 min) */
  toleranceSeconds?: number;
  /** Noms des clés dans le header si différents de "t"/"v1" (ex: Stripe utilise aussi "t"/"v1") */
  timestampKey?: string;
  signatureKey?: string;
  /**
   * Séparateur entre le timestamp et le corps dans le message signé.
   * - Wave : "" (défaut) — message signé = `${timestamp}${rawBody}`
   * - Stripe : "." — message signé = `${timestamp}.${rawBody}`
   */
  payloadSeparator?: string;
}

/**
 * Vérifie une signature au format "t=<timestamp>,v1=<signature>" — le format
 * partagé par Wave, Stripe, et de nombreux autres providers de paiement.
 * Protège aussi contre le rejeu grâce à la tolérance de timestamp. Si le
 * header contient plusieurs signatures (rotation de secret), la vérification
 * réussit dès que l'une d'elles est valide.
 *
 * @example
 * // Wave
 * const result = verifyTimestampedHmacSignature({
 *   rawBody,
 *   signatureHeader: request.headers.get("Wave-Signature"),
 *   secret: process.env.WAVE_WEBHOOK_SECRET!,
 * });
 *
 * // Stripe
 * const result = verifyTimestampedHmacSignature({
 *   rawBody,
 *   signatureHeader: request.headers.get("Stripe-Signature"),
 *   secret: process.env.STRIPE_WEBHOOK_SECRET!,
 *   payloadSeparator: ".",
 * });
 */
export function verifyTimestampedHmacSignature(
  options: VerifyTimestampedHmacOptions
): VerificationResult {
  const {
    rawBody,
    signatureHeader,
    secret,
    toleranceSeconds = 300,
    timestampKey = "t",
    signatureKey = "v1",
    payloadSeparator = "",
  } = options;

  if (!signatureHeader) {
    return { valid: false, reason: "Header de signature manquant" };
  }

  let timestamp: string | undefined;
  const signatures: string[] = [];
  for (const segment of signatureHeader.split(",")) {
    const separatorIndex = segment.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = segment.slice(0, separatorIndex).trim();
    const value = segment.slice(separatorIndex + 1).trim();
    if (key === timestampKey) timestamp = value;
    else if (key === signatureKey && value.length > 0) signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) {
    return { valid: false, reason: "Format de signature invalide" };
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (Number.isNaN(ageSeconds) || ageSeconds > toleranceSeconds) {
    return { valid: false, reason: "Timestamp expiré ou invalide" };
  }

  const signedTimestamp = timestamp;
  const isValid = signatures.some(
    (signature) =>
      verifyHmacSignature({
        rawBody,
        signatureHeader: signature,
        secret,
        buildSignedMessage: () => `${signedTimestamp}${payloadSeparator}${rawBody}`,
      }).valid
  );

  return isValid ? { valid: true } : { valid: false, reason: "Signature invalide" };
}
