'use client';

/**
 * Journey Simulator Form
 * Generate journey draft for a client
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/shared/Button';
import { useServices } from '@/lib/hooks/useServices';
import { ClientRecord, JourneyCategory, DiscretionLevel } from '@/lib/types/entities';
import { toast } from 'sonner';

const MOCK_RM_USER_ID = 'b2b-rm-001-uuid-placeholder';

const journeyCategories: JourneyCategory[] = [
  'Travel',
  'Investment',
  'Estate Planning',
  'Philanthropy',
  'Family Education',
  'Wellness',
  'Concierge',
  'Other',
];

const discretionLevels: DiscretionLevel[] = ['High', 'Medium', 'Standard'];

const journeySimulatorSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  category: z.enum([
    'Travel',
    'Investment',
    'Estate Planning',
    'Philanthropy',
    'Family Education',
    'Wellness',
    'Concierge',
    'Other',
  ] as const),
  emotionalObjective: z
    .string()
    .min(10, 'Emotional objective must be at least 10 characters')
    .max(500, 'Emotional objective must be less than 500 characters'),
  discretionLevel: z.enum(['High', 'Medium', 'Standard'] as const),
  additionalContext: z.string().max(1000, 'Additional context must be less than 1000 characters').optional(),
});

type JourneySimulatorFormData = z.infer<typeof journeySimulatorSchema>;

export function JourneySimulatorForm() {
  const router = useRouter();
  const services = useServices();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JourneySimulatorFormData>({
    resolver: zodResolver(journeySimulatorSchema),
    defaultValues: {
      discretionLevel: 'Standard',
    },
  });

  const selectedClientId = watch('clientId');
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const rmClients = await services.client.getClientsByRM(MOCK_RM_USER_ID);
      // Filter to active clients only
      setClients(rmClients.filter((c) => c.status === 'Active'));
    } catch (error) {
      console.error('Failed to load clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: JourneySimulatorFormData) => {
    try {
      setSubmitting(true);

      const client = clients.find((c) => c.id === data.clientId);
      if (!client) {
        toast.error('Client not found');
        return;
      }

      // Generate journey narrative using template approach
      const narrative = generateJourneyNarrative(data, client);

      // Create journey
      const journey = await services.journey.createJourney({
        userId: client.userId,
        title: generateJourneyTitle(data.category, client.name),
        narrative,
        category: data.category,
        context: 'b2b',
      });

      // Update with additional fields
      await services.journey.updateJourney(journey.id, {
        emotionalObjective: data.emotionalObjective,
        discretionLevel: data.discretionLevel,
        assignedRM: MOCK_RM_USER_ID,
        institutionId: client.institutionId,
        strategicReasoning: generateStrategicReasoning(data, client),
        riskSummary: generateRiskSummary(data, client),
      });

      toast.success(`Journey draft generated for ${client.name}`);
      router.push(`/governance/${journey.id}`);
    } catch (error) {
      console.error('Failed to generate journey:', error);
      toast.error('Failed to generate journey');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center font-sans text-slate-600">Loading clients...</div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Select Client */}
      <div>
        <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
          Select Client <span className="text-rose-600">*</span>
        </label>
        <select
          {...register('clientId')}
          className="w-full px-4 py-3 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        >
          <option value="">Choose a client...</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.riskCategory} Risk
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="mt-1 font-sans text-xs text-rose-600">{errors.clientId.message}</p>
        )}

        {/* Client Preview Card */}
        {selectedClient && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-sans font-semibold text-sm text-slate-900 mb-2">
              {selectedClient.name}
            </h4>
            <div className="space-y-1 font-sans text-xs text-slate-600">
              <p>Risk Category: {selectedClient.riskCategory}</p>
              <p>Active Journeys: {selectedClient.activeJourneyCount}</p>
              {selectedClient.emotionalProfile && (
                <div className="mt-2">
                  <p className="font-semibold text-slate-700 mb-1">Emotional Profile:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedClient.emotionalProfile).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Journey Category */}
      <div>
        <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
          Journey Category <span className="text-rose-600">*</span>
        </label>
        <select
          {...register('category')}
          className="w-full px-4 py-3 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        >
          <option value="">Choose a category...</option>
          {journeyCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 font-sans text-xs text-rose-600">{errors.category.message}</p>
        )}
      </div>

      {/* Emotional Objective */}
      <div>
        <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
          Emotional Objective <span className="text-rose-600">*</span>
        </label>
        <textarea
          {...register('emotionalObjective')}
          rows={4}
          placeholder="What emotional outcome should this journey target? (e.g., 'Reconnect with family values through shared experience', 'Find clarity during career transition')"
          className="w-full px-4 py-3 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
        />
        {errors.emotionalObjective && (
          <p className="mt-1 font-sans text-xs text-rose-600">
            {errors.emotionalObjective.message}
          </p>
        )}
      </div>

      {/* Discretion Level */}
      <div>
        <label className="block font-sans text-sm font-medium text-slate-700 mb-3">
          Discretion Level <span className="text-rose-600">*</span>
        </label>
        <div className="space-y-3">
          {discretionLevels.map((level) => (
            <label key={level} className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                {...register('discretionLevel')}
                value={level}
                className="mt-1 w-4 h-4 text-rose-600 focus:ring-rose-500"
              />
              <div>
                <span className="font-sans text-sm font-medium text-slate-900">{level}</span>
                <p className="font-sans text-xs text-slate-600 mt-0.5">
                  {level === 'High' &&
                    'Maximum privacy, no paper trail, ultra-private arrangements'}
                  {level === 'Medium' &&
                    'Balanced privacy with some documentation, selective disclosure'}
                  {level === 'Standard' && 'Standard protocols, normal documentation processes'}
                </p>
              </div>
            </label>
          ))}
        </div>
        {errors.discretionLevel && (
          <p className="mt-1 font-sans text-xs text-rose-600">
            {errors.discretionLevel.message}
          </p>
        )}
      </div>

      {/* Additional Context */}
      <div>
        <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
          Additional Context <span className="text-slate-500">(Optional)</span>
        </label>
        <textarea
          {...register('additionalContext')}
          rows={3}
          placeholder="Any specific requirements, constraints, or context to inform the journey proposal..."
          className="w-full px-4 py-3 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
        />
        {errors.additionalContext && (
          <p className="mt-1 font-sans text-xs text-rose-600">
            {errors.additionalContext.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={submitting}
          className="min-w-[160px]"
        >
          {submitting ? 'Generating...' : 'Generate Journey'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push('/governance')}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Helper functions for journey generation

function generateJourneyTitle(category: JourneyCategory, clientName: string): string {
  const firstName = clientName.split(' ')[0];
  const templates: Record<JourneyCategory, string[]> = {
    Travel: [
      `The ${firstName} Expedition`,
      `${firstName}'s Journey of Discovery`,
      `The Private Sojourn`,
    ],
    Investment: [
      `The Portfolio Renaissance`,
      `Strategic Allocation Framework`,
      `The Impact Investment Initiative`,
    ],
    'Estate Planning': [
      `The Legacy Structure`,
      `Dynastic Framework Design`,
      `Generational Wealth Blueprint`,
    ],
    Philanthropy: [
      `The ${firstName} Foundation Initiative`,
      `Impact Strategy Framework`,
      `The Giving Architecture`,
    ],
    'Family Education': [
      `The Next Generation Program`,
      `Family Leadership Retreat`,
      `Generational Transition Framework`,
    ],
    Wellness: [
      `The Renewal Protocol`,
      `The ${firstName} Optimization Program`,
      `Cognitive Restoration Initiative`,
    ],
    Concierge: [`The Impossible Request`, `Bespoke Arrangement`, `Private Coordination`],
    Other: [`Custom Journey Proposal`, `Bespoke Initiative`, `The ${firstName} Project`],
  };

  const options = templates[category] || templates.Other;
  return options[Math.floor(Math.random() * options.length)]!;
}

function generateJourneyNarrative(
  data: JourneySimulatorFormData,
  client: ClientRecord
): string {
  const category = data.category;
  const emotionalObjective = data.emotionalObjective;
  const additionalContext = data.additionalContext || '';

  // Template-based narrative generation
  let narrative = `This ${category.toLowerCase()} journey is designed specifically for ${
    client.name
  }, with the primary emotional objective of: ${emotionalObjective}.\n\n`;

  // Add category-specific content
  if (category === 'Travel') {
    narrative += `The journey unfolds over carefully curated experiences that balance exploration with intentional reflection. Each destination and activity has been selected to align with the client's emotional landscape and life stage. The itinerary maintains flexibility to adapt to emerging needs while providing structure around key transformational moments.\n\n`;
  } else if (category === 'Investment') {
    narrative += `This investment strategy integrates financial objectives with personal values, creating a portfolio that reflects both fiscal responsibility and emotional alignment. The approach balances risk tolerance with long-term vision, incorporating both traditional and impact investment vehicles.\n\n`;
  } else if (category === 'Estate Planning') {
    narrative += `This comprehensive estate planning framework addresses both technical and emotional dimensions of wealth transition. The structure protects assets while preserving family values and autonomy across generations. Implementation involves coordination with legal, tax, and family governance specialists.\n\n`;
  } else if (category === 'Philanthropy') {
    narrative += `This philanthropic initiative creates measurable impact aligned with personal values. The approach combines strategic giving with operational excellence, ensuring both immediate results and sustainable long-term outcomes. Implementation includes governance structures and impact measurement frameworks.\n\n`;
  } else if (category === 'Family Education') {
    narrative += `This family education program prepares the next generation for responsible stewardship through experiential learning and facilitated dialogue. The curriculum balances technical knowledge with emotional intelligence, creating capability and alignment across generations.\n\n`;
  } else if (category === 'Wellness') {
    narrative += `This wellness protocol integrates evidence-based interventions with personalized optimization strategies. The program addresses physical, cognitive, and emotional dimensions of well-being through diagnostic assessment and targeted interventions. Implementation includes ongoing monitoring and adjustment.\n\n`;
  } else if (category === 'Concierge') {
    narrative += `This bespoke service arrangement leverages our global network and execution capabilities to deliver exceptional outcomes. The approach prioritizes discretion, excellence, and seamless coordination across all touchpoints.\n\n`;
  }

  // Add emotional profile context if available
  if (client.emotionalProfile) {
    const { security, adventure, legacy, recognition, autonomy } = client.emotionalProfile;
    narrative += `This proposal takes into account the client's emotional profile: `;
    const drivers: string[] = [];
    if (security > 70) drivers.push('strong need for security and predictability');
    if (adventure > 70) drivers.push('desire for novel experiences');
    if (legacy > 70) drivers.push('focus on generational impact');
    if (recognition > 70) drivers.push('value of acknowledgment and visibility');
    if (autonomy > 70) drivers.push('emphasis on personal control and independence');
    narrative += drivers.join(', ') + '.\n\n';
  }

  // Add discretion level consideration
  narrative += `This journey is structured with ${data.discretionLevel.toLowerCase()} discretion protocols, ensuring appropriate privacy and documentation standards throughout execution.\n\n`;

  // Add additional context if provided
  if (additionalContext) {
    narrative += `Additional considerations: ${additionalContext}\n\n`;
  }

  narrative += `This proposal serves as a starting framework for discussion and refinement. All elements are customizable based on client feedback and evolving circumstances.`;

  return narrative;
}

function generateStrategicReasoning(
  data: JourneySimulatorFormData,
  client: ClientRecord
): string {
  const parts: string[] = [];

  // Risk category alignment
  parts.push(
    `${client.riskCategory} risk profile indicates ${
      client.riskCategory === 'Low'
        ? 'preference for controlled, predictable experiences'
        : client.riskCategory === 'High'
          ? 'comfort with uncertainty and novel situations'
          : 'balanced approach to risk and reward'
    }`
  );

  // Journey history
  if (client.totalJourneyCount > 10) {
    parts.push(`extensive journey history (${client.totalJourneyCount} total) suggests sophisticated expectations and deep platform familiarity`);
  }

  // Emotional objective alignment
  parts.push(`${data.category} category directly addresses stated emotional objective`);

  return parts.join('; ') + '.';
}

function generateRiskSummary(data: JourneySimulatorFormData, client: ClientRecord): string {
  const category = data.category;
  const riskLevel =
    client.riskCategory === 'Low'
      ? 'low'
      : client.riskCategory === 'High'
        ? 'moderate to high'
        : 'moderate';

  const categoryRisks: Record<JourneyCategory, string> = {
    Travel: 'logistical complexity, weather dependencies, health and safety considerations',
    Investment: 'market volatility, regulatory changes, liquidity considerations',
    'Estate Planning':
      'legal complexity, tax law changes, family dynamics, multi-jurisdictional coordination',
    Philanthropy: 'operational complexity, stakeholder alignment, impact measurement challenges',
    'Family Education': 'emotional complexity, generational dynamics, engagement variability',
    Wellness: 'medical considerations, protocol adherence, outcome variability',
    Concierge: 'variable depending on specific request, reputational considerations',
    Other: 'requires detailed risk assessment based on specific scope',
  };

  return `${riskLevel} overall risk profile; primary considerations include ${categoryRisks[category] || 'detailed assessment pending'}; risk mitigation strategies to be implemented throughout execution.`;
}
