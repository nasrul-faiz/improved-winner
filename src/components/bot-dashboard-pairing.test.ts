import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveEffectivePairingMethod, sanitizePhoneNumber } from './bot-dashboard-pairing.ts'

test('prefers the live bot status over stale local pairing selection for QR mode', () => {
  const method = resolveEffectivePairingMethod({
    status: 'qr',
    pairingMethod: 'phone',
  }, 'phone')

  assert.equal(method, 'qr')
})

test('switches to phone pairing when WhatsApp is waiting for a code', () => {
  const method = resolveEffectivePairingMethod({
    status: 'pairing-code',
    pairingMethod: 'qr',
  }, 'qr')

  assert.equal(method, 'phone')
})

test('sanitizes phone input before sending to WhatsApp pairing', () => {
  assert.equal(sanitizePhoneNumber('+60 12-3456 789'), '60123456789')
  assert.equal(sanitizePhoneNumber('60123456789'), '60123456789')
  assert.equal(sanitizePhoneNumber('0123456789'), '0123456789')
})
