'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/shared/Button/Button'
import { Input } from '@/components/shared/Input/Input'
import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal'
import { cn } from '@/lib/utils/cn'

// Metadata is set in layout.tsx - client components cannot export metadata

// Invite code validation schema
const inviteCodeSchema = z.object({
  inviteCode: z
    .string()
    .min(1, 'Invite code is required')
    .regex(
      /^ELAN-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
      'Invalid invite code format'
    ),
})

type InviteCodeForm = z.infer<typeof inviteCodeSchema>

export default function InvitePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InviteCodeForm>({
    resolver: zodResolver(inviteCodeSchema),
    mode: 'onSubmit',
  })

  const inviteCodeValue = watch('inviteCode', '')

  // Auto-format invite code input
  const handleInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')

    // Insert dashes after every 4 characters
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4)
    }
    if (value.length > 9) {
      value = value.slice(0, 9) + '-' + value.slice(9)
    }
    if (value.length > 14) {
      value = value.slice(0, 14) + '-' + value.slice(14)
    }

    // Limit to full invite code length
    if (value.length > 19) {
      value = value.slice(0, 19)
    }

    setValue('inviteCode', value, { shouldValidate: false })
  }

  const onSubmit = async (data: InviteCodeForm) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      // Call backend validation API
      const response = await fetch('/api/invite/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: data.inviteCode }),
      })

      const result = await response.json()

      if (result.valid) {
        // Success - store validated code and type in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('validatedInviteCode', data.inviteCode)
          sessionStorage.setItem('inviteType', result.type || 'b2c')
        }
        setIsVerified(true)
      } else {
        // API returned invalid
        setApiError(result.error || 'Invalid invite code')
      }
    } catch (error) {
      console.error('Validation error:', error)
      setApiError('Unable to validate invite code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sand-50/30 to-sand-50" />

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-6 py-32">
        <div className="w-full max-w-md space-y-12">
          {!isVerified ? (
            <>
              {/* Header */}
              <ScrollReveal delay={0}>
                <div className="space-y-6 text-center">
                  <p className="font-sans text-xs uppercase tracking-[0.3em] text-sand-500">
                    Exclusive Membership
                  </p>
                  <h1 className="font-serif text-4xl text-rose-900 md:text-5xl">
                    Enter Your Invitation
                  </h1>
                  <p className="mx-auto max-w-sm font-sans text-base leading-relaxed text-sand-600">
                    Élan Glimmora is available by invitation only. Enter your personal code
                    to begin.
                  </p>
                </div>
              </ScrollReveal>

              {/* Form */}
              <ScrollReveal delay={0.1}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Input
                      {...register('inviteCode')}
                      id="inviteCode"
                      placeholder="ELAN-XXXX-XXXX-XXXX"
                      className={cn(
                        'font-mono text-center text-lg tracking-widest',
                        errors.inviteCode && 'animate-shake'
                      )}
                      error={errors.inviteCode?.message}
                      onChange={handleInviteCodeChange}
                      value={inviteCodeValue}
                      disabled={isSubmitting}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {apiError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-center font-sans text-sm text-rose-600"
                      >
                        {apiError}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-rose-900 text-white hover:bg-rose-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Invitation'}
                  </Button>
                </form>
              </ScrollReveal>

              {/* Bottom text */}
              <ScrollReveal delay={0.2}>
                <div className="space-y-3 text-center">
                  <p className="font-sans text-sm text-sand-500">
                    Already a member?{' '}
                    <Link
                      href="/invite/login"
                      className="text-rose-700 hover:text-rose-900 underline underline-offset-2 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                  <p className="font-sans text-xs text-sand-400">
                    Don&apos;t have an invitation? Contact your advisor.
                  </p>
                </div>
              </ScrollReveal>
            </>
          ) : (
            // Success state
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 text-center"
            >
              {/* Success icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Check className="h-10 w-10 text-green-600" />
              </div>

              {/* Success message */}
              <div className="space-y-4">
                <h2 className="font-serif text-3xl text-rose-900">
                  Invitation Verified
                </h2>
                <p className="font-sans text-base text-sand-600">
                  Preparing your experience...
                </p>
              </div>

              {/* Continue button */}
              <Link href="/invite/register">
                <Button variant="primary" size="lg" className="w-full bg-rose-900">
                  Continue
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
