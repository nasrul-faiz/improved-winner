export type PairingMethod = 'qr' | 'phone'

export type BotPairingStatusState = {
  status?: string | null
  pairingMethod?: PairingMethod | null
}

export function sanitizePhoneNumber(rawValue: string): string {
  const candidate = String(rawValue ?? '').trim()
  if (!candidate) return ''

  const normalized = candidate
    .replace(/\s+/g, '')
    .replace(/[^\d+]/g, '')
    .replace(/^00+/, '')
    .replace(/^\+/, '')

  return normalized
}

export function resolveEffectivePairingMethod(
  state: BotPairingStatusState | null | undefined,
  activeLocalMethod: PairingMethod,
): PairingMethod {
  const liveMethod = state?.pairingMethod ?? null
  const liveStatus = state?.status ?? null

  if (liveStatus === 'pairing-phone' || liveStatus === 'pairing-code') {
    return 'phone'
  }

  if (liveStatus === 'qr' || liveStatus === 'starting' || liveStatus === 'reconnecting') {
    return 'qr'
  }

  if (liveMethod === 'phone' || liveMethod === 'qr') {
    return liveMethod
  }

  return activeLocalMethod
}
