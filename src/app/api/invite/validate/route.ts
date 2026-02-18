import { NextResponse } from 'next/server'
import { validateInviteCode } from '@/lib/auth/invite-codes'

/**
 * POST /api/invite/validate
 *
 * Validates invite code against backend (existence, status, usage limits, expiry)
 *
 * Upgraded from format-only stub (02-01) to real backend validation (02-03)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code } = body

    // Validate request body
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Invite code is required' },
        { status: 400 }
      )
    }

    // Real backend validation via service layer
    const validation = await validateInviteCode(code)

    if (!validation.valid) {
      return NextResponse.json(
        { valid: false, error: validation.error },
        { status: 422 }
      )
    }

    return NextResponse.json(
      { valid: true, type: validation.inviteCode!.type },
      { status: 200 }
    )
  } catch (error) {
    console.error('Invite validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
