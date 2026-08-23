import { createHmac, timingSafeEqual } from "node:crypto"

export const sessionCookieName = "learning_hub_session"

function getAuthSecret() {
  const secret = process.env.LEARNING_HUB_SESSION_SECRET

  if (!secret) {
    throw new Error("LEARNING_HUB_SESSION_SECRET is not configured")
  }

  return secret
}

export function isValidUsername(username: string) {
  return username.trim().toLowerCase() === (process.env.LEARNING_HUB_USERNAME ?? "").trim().toLowerCase()
}

export function isValidPassword(password: string) {
  const expected = Buffer.from(process.env.LEARNING_HUB_PASSWORD ?? "")
  const received = Buffer.from(password)
  return expected.length > 0 && expected.length === received.length && timingSafeEqual(expected, received)
}

export function createSessionToken() {
  const payload = "learning-hub-authenticated"
  const signature = createHmac("sha256", getAuthSecret()).update(payload).digest("hex")
  return `${payload}.${signature}`
}

export function isValidSessionToken(token: string | undefined) {
  if (!token) return false

  const expected = createSessionToken()
  const receivedBuffer = Buffer.from(token)
  const expectedBuffer = Buffer.from(expected)
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer)
}
