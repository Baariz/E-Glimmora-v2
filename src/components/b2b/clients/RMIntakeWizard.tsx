'use client'

/**
 * RM-Led Emotional Intake Wizard
 * 5-step wizard for conducting emotional intake on behalf of UHNI client
 */

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { useWizard } from '@/lib/hooks/useWizard'
import { useServices } from '@/lib/hooks/useServices'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { LifeStage, TravelMode, RiskTolerance, EmotionalDrivers } from '@/lib/types'

interface RMIntakeWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  clientName: string
  userId: string
  onComplete: () => void
}

interface IntakeData {
  lifeStage?: LifeStage
  emotionalOutcomes?: string[]
  travelMode?: TravelMode
  priorities?: string[]
  discretionLevel?: 'High' | 'Medium' | 'Standard'
  riskTolerance?: RiskTolerance
}

const EMPTY_INITIAL_DATA: IntakeData = {}

export function RMIntakeWizard({
  open,
  onOpenChange,
  clientId,
  clientName,
  userId,
  onComplete,
}: RMIntakeWizardProps) {
  const services = useServices()
  const initialDataRef = useRef(EMPTY_INITIAL_DATA)

  const wizard = useWizard<IntakeData>({
    totalSteps: 5,
    storageKey: `wizard_rm_intake_${clientId}`,
    initialData: initialDataRef.current,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: string, value: any) => {
    wizard.next({ [field]: value } as Partial<IntakeData>)
    wizard.back() // Stay on current step
  }

  const toggleArrayValue = (field: string, value: string) => {
    const current = (wizard.formData[field as keyof IntakeData] as string[]) || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateField(field, updated)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Map selections to emotional drivers (simplified scoring)
      const emotionalDrivers: EmotionalDrivers = {
        security: wizard.formData.lifeStage === 'Preserving' ? 85 : 50,
        adventure: wizard.formData.travelMode === 'Adventure' ? 90 : 40,
        legacy: wizard.formData.lifeStage === 'Legacy Planning' ? 95 : 50,
        recognition: wizard.formData.emotionalOutcomes?.includes('Recognition') ? 80 : 40,
        autonomy: wizard.formData.discretionLevel === 'High' ? 95 : 60,
      }

      // Create intent profile
      await services.intent.createIntentProfile({
        userId,
        emotionalDrivers,
        riskTolerance: wizard.formData.riskTolerance || 'Moderate',
        values: wizard.formData.emotionalOutcomes || [],
        lifeStage: wizard.formData.lifeStage || 'Building',
        travelMode: wizard.formData.travelMode,
        priorities: wizard.formData.priorities,
        discretionPreference: wizard.formData.discretionLevel,
      })

      // Update client record with emotional profile
      await services.client.updateClient(clientId, {
        emotionalProfile: emotionalDrivers,
      })

      wizard.reset()
      toast.success(`Emotional profile created for ${clientName}`)
      onComplete()
    } catch (error) {
      console.error('Failed to create emotional profile:', error)
      toast.error('Failed to create profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Emotional Intake: ${clientName}`}
      description="Guide the client through their emotional and lifestyle preferences"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Step Progress */}
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-semibold ${
                  step < wizard.currentStep
                    ? 'bg-teal-500 text-white'
                    : step === wizard.currentStep
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step < wizard.currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 5 && (
                <div
                  className={`h-0.5 w-8 mx-1 ${
                    step < wizard.currentStep ? 'bg-teal-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {/* Step 1: Life Phase */}
          {wizard.currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-slate-900">Client&apos;s Life Phase</h3>
              <p className="font-sans text-sm text-slate-600">
                Where is the client in their wealth journey?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: 'Building', label: 'Building', desc: 'Accumulating wealth' },
                  { value: 'Preserving', label: 'Preserving', desc: 'Protecting assets' },
                  { value: 'Transitioning', label: 'Transitioning', desc: 'Life changes' },
                  {
                    value: 'Legacy Planning',
                    label: 'Legacy Planning',
                    desc: 'Multi-generational',
                  },
                ].map((phase) => (
                  <button
                    key={phase.value}
                    onClick={() => updateField('lifeStage', phase.value)}
                    className="w-full text-left"
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        wizard.formData.lifeStage === phase.value
                          ? 'border-2 border-rose-500 bg-rose-50'
                          : 'hover:border-rose-300'
                      }`}
                    >
                      <p className="font-sans font-semibold text-slate-900">{phase.label}</p>
                      <p className="font-sans text-sm text-slate-600">{phase.desc}</p>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Emotional Outcomes */}
          {wizard.currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-slate-900">Emotional Outcomes</h3>
              <p className="font-sans text-sm text-slate-600">
                What does the client want to feel? (Select 2-3)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Security',
                  'Adventure',
                  'Legacy',
                  'Recognition',
                  'Freedom',
                  'Connection',
                  'Growth',
                  'Peace',
                ].map((outcome) => (
                  <button
                    key={outcome}
                    onClick={() => toggleArrayValue('emotionalOutcomes', outcome)}
                    className="w-full text-left"
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        wizard.formData.emotionalOutcomes?.includes(outcome)
                          ? 'border-2 border-rose-500 bg-rose-50'
                          : 'hover:border-rose-300'
                      }`}
                    >
                      <p className="font-sans font-semibold text-slate-900">{outcome}</p>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Travel Mode */}
          {wizard.currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-slate-900">Travel Mode</h3>
              <p className="font-sans text-sm text-slate-600">
                How does the client prefer to travel?
              </p>
              <div className="space-y-2">
                {[
                  { value: 'Luxury', desc: 'Five-star resorts, premium experiences' },
                  { value: 'Adventure', desc: 'Off-the-beaten-path, unique experiences' },
                  { value: 'Wellness', desc: 'Spa retreats, mindfulness' },
                  { value: 'Cultural', desc: 'Museums, heritage sites, local immersion' },
                  { value: 'Exclusive Access', desc: 'Private events, VIP experiences' },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => updateField('travelMode', mode.value)}
                    className="w-full text-left"
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        wizard.formData.travelMode === mode.value
                          ? 'border-2 border-rose-500 bg-rose-50'
                          : 'hover:border-rose-300'
                      }`}
                    >
                      <p className="font-sans font-semibold text-slate-900">{mode.value}</p>
                      <p className="font-sans text-sm text-slate-600">{mode.desc}</p>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Priorities */}
          {wizard.currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-slate-900">Client Priorities</h3>
              <p className="font-sans text-sm text-slate-600">
                What matters most to the client? (Select top 3)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Family Time',
                  'Personal Growth',
                  'Giving Back',
                  'Financial Security',
                  'Health & Wellness',
                  'Career Success',
                  'Travel & Exploration',
                  'Privacy & Discretion',
                ].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => toggleArrayValue('priorities', priority)}
                    className="w-full text-left"
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        wizard.formData.priorities?.includes(priority)
                          ? 'border-2 border-rose-500 bg-rose-50'
                          : 'hover:border-rose-300'
                      }`}
                    >
                      <p className="font-sans font-semibold text-slate-900">{priority}</p>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Discretion Level */}
          {wizard.currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-slate-900">Discretion Level</h3>
              <p className="font-sans text-sm text-slate-600">
                How private should their information be?
              </p>
              <div className="space-y-2">
                {[
                  {
                    value: 'High',
                    label: 'High Discretion',
                    desc: 'Maximum privacy, minimal data retention, need-to-know only',
                  },
                  {
                    value: 'Medium',
                    label: 'Medium Discretion',
                    desc: 'Balanced privacy with operational efficiency',
                  },
                  {
                    value: 'Standard',
                    label: 'Standard Discretion',
                    desc: 'Normal institutional privacy protocols',
                  },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => {
                      updateField('discretionLevel', level.value)
                      updateField(
                        'riskTolerance',
                        level.value === 'High' ? 'Conservative' : 'Moderate'
                      )
                    }}
                    className="w-full text-left"
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        wizard.formData.discretionLevel === level.value
                          ? 'border-2 border-rose-500 bg-rose-50'
                          : 'hover:border-rose-300'
                      }`}
                    >
                      <p className="font-sans font-semibold text-slate-900">{level.label}</p>
                      <p className="font-sans text-sm text-slate-600">{level.desc}</p>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={() => wizard.back()}
            disabled={wizard.isFirstStep || isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {wizard.isLastStep ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Complete Intake
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => wizard.next({})}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
