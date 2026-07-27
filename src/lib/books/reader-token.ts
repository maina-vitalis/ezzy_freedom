import { SignJWT, jwtVerify } from "jose";

export type ReaderTokenKind = "book" | "article";

export type ReaderTokenPayload = {
  uid: string;
  cid: string;
  kind: ReaderTokenKind;
  r2Key: string;
};

const COOKIE_NAME = "ezzy_reader";
const TTL_SECONDS = 10 * 60; // 10 minutes — enough for a reading burst on Vercel

function getSecretKey() {
  const secret =
    process.env.BETTER_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.READER_TOKEN_SECRET;
  if (!secret) {
    throw new Error(
      "Missing BETTER_AUTH_SECRET (or AUTH_SECRET / READER_TOKEN_SECRET) for reader tokens.",
    );
  }
  return new TextEncoder().encode(secret);
}

export function readerCookieName() {
  return COOKIE_NAME;
}

export async function signReaderToken(
  payload: ReaderTokenPayload,
): Promise<string> {
  return new SignJWT({
    cid: payload.cid,
    kind: payload.kind,
    r2Key: payload.r2Key,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.uid)
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyReaderToken(
  token: string,
): Promise<ReaderTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    const uid = payload.sub;
    const cid = payload.cid;
    const kind = payload.kind;
    const r2Key = payload.r2Key;
    if (
      typeof uid !== "string" ||
      typeof cid !== "string" ||
      (kind !== "book" && kind !== "article") ||
      typeof r2Key !== "string"
    ) {
      return null;
    }
    return { uid, cid, kind, r2Key };
  } catch {
    return null;
  }
}

export function readerTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: TTL_SECONDS,
  };
}
