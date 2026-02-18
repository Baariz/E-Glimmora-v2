/**
 * Mock AI Narrative Generator (JRNY-01)
 * Generates 3-5 personalized journey narratives from an intent profile.
 * Template-based approach with variation based on life stage and emotional drivers.
 *
 * This simulates the "Journey Intelligence" AI that creates bespoke travel
 * proposals from the UHNI's emotional landscape.
 */

import type { IntentProfile, Journey, JourneyCategory, DiscretionLevel } from '@/lib/types/entities';
import { JourneyStatus } from '@/lib/types/entities';
import { MockJourneyService } from '@/lib/services/mock/journey.mock';

interface NarrativeTemplate {
  category: JourneyCategory;
  title: string;
  narrative: string;
  emotionalObjective: string;
  strategicReasoning: string;
  riskSummary: string;
  discretionLevel: DiscretionLevel;
  /** Which emotional drivers this template targets (used for matching) */
  targetDrivers: Array<keyof IntentProfile['emotionalDrivers']>;
  /** Life stages this template works best for */
  idealLifeStages: IntentProfile['lifeStage'][];
}

/** 10+ narrative templates for variety */
const NARRATIVE_TEMPLATES: NarrativeTemplate[] = [
  {
    category: 'Travel',
    title: 'The Archipelago of Renewal',
    narrative: `A three-week private yacht expedition through the lesser-known islands of the Cyclades. Your journey begins in Mykonos but quickly leaves the tourist corridors behind. You'll spend mornings anchored in hidden coves accessible only by sea, afternoons exploring Byzantine ruins with a personal historian, and evenings dining on locally-sourced cuisine prepared by your onboard Michelin-trained chef. The itinerary includes private access to archaeological sites normally closed to visitors, guided meditation sessions at sunrise overlooking the Aegean, and opportunities to engage with local artisans preserving ancient crafts. This is not about destinations—it's about the rhythm of sea and stone, the slow unfolding of forgotten stories, and the chance to rediscover silence in motion.`,
    emotionalObjective: 'Reconnect with personal values through intentional slowness and cultural immersion',
    strategicReasoning: 'High security scores suggest need for controlled environment; legacy focus aligns with cultural preservation themes; moderate adventure tolerance supports curated exploration over extreme activities',
    riskSummary: 'Low physical risk; moderate logistical complexity (yacht coordination, private site access); weather-dependent scheduling',
    discretionLevel: 'High',
    targetDrivers: ['security', 'legacy'],
    idealLifeStages: ['Preserving', 'Transitioning', 'Legacy Planning'],
  },
  {
    category: 'Philanthropy',
    title: 'The Education Corridor Initiative',
    narrative: `Partner with four established schools across rural Kenya to design and fund a five-year literacy program. This journey is both physical and strategic: You'll visit each school over a two-week period, meeting educators, students, and community leaders. Together with educational consultants from Oxford and locally-based NGO directors, you'll craft a curriculum that blends local storytelling traditions with modern digital literacy. The program includes teacher training, library construction, and scholarship endowments. You'll also establish measurable impact metrics and governance structures to ensure sustainability beyond your direct involvement. This is legacy-building in real time—transforming educational access while creating a model that can scale to other regions.`,
    emotionalObjective: 'Create lasting impact aligned with values of knowledge preservation and opportunity expansion',
    strategicReasoning: 'Legacy driver dominance indicates focus on generational impact; education aligns with knowledge preservation; moderate risk tolerance supports structured philanthropy over experimental ventures',
    riskSummary: 'Low financial risk (structured giving); moderate operational complexity (multi-stakeholder coordination); cultural sensitivity required',
    discretionLevel: 'Medium',
    targetDrivers: ['legacy', 'recognition'],
    idealLifeStages: ['Legacy Planning', 'Transitioning'],
  },
  {
    category: 'Travel',
    title: 'The Patagonian Solitude Expedition',
    narrative: `Fourteen days in Chilean Patagonia, structured around solitude, physical challenge, and wilderness immersion. You'll trek through Torres del Paine with an elite guide team, camp under some of the clearest skies on Earth, and traverse glaciers that have existed for millennia. Each day balances strenuous hiking (8-12 miles) with periods of complete stillness—time to journal, photograph, or simply absorb the vastness. You'll have satellite communication for safety but no internet access. The expedition concludes with three nights at an eco-lodge where you'll debrief with a wilderness therapist who specializes in executive transitions. This journey strips away the noise to reveal what remains when everything else is gone.`,
    emotionalObjective: 'Test personal limits and rediscover autonomy through physical challenge and digital detox',
    strategicReasoning: 'High adventure and autonomy scores support physically demanding experience; transitioning life stage suggests readiness for introspection; high discretion level maintains privacy during vulnerable exploration',
    riskSummary: 'Moderate physical risk (altitude, weather, terrain); low logistical risk (experienced guides, emergency protocols); requires good baseline fitness',
    discretionLevel: 'High',
    targetDrivers: ['adventure', 'autonomy'],
    idealLifeStages: ['Transitioning', 'Building'],
  },
  {
    category: 'Wellness',
    title: 'The Neuroscience of Rest',
    narrative: `A ten-day private wellness residency in the Swiss Alps, designed around the science of recovery and cognitive optimization. Working with neurologists, sleep specialists, and performance psychologists, you'll undergo comprehensive diagnostics (brain imaging, metabolic testing, genetic analysis) and receive a personalized protocol for stress resilience, sleep architecture, and mental clarity. Days include cryotherapy, altitude training, guided breathwork, and one-on-one sessions with researchers from ETH Zurich. Evenings feature chef-prepared meals optimized for your metabolic profile. You'll leave with a detailed roadmap for sustaining peak cognitive function and a team of specialists available for ongoing consultation. This is precision wellness—not spa indulgence, but systematic recalibration.`,
    emotionalObjective: 'Restore cognitive capacity and build sustainable practices for long-term performance',
    strategicReasoning: 'Security driver suggests preference for evidence-based interventions; autonomy focus aligns with self-optimization; preserving life stage indicates need to maintain current capabilities',
    riskSummary: 'Low overall risk; requires medical clearance; some diagnostic procedures mildly invasive; no significant physical demands',
    discretionLevel: 'High',
    targetDrivers: ['security', 'autonomy'],
    idealLifeStages: ['Preserving', 'Building'],
  },
  {
    category: 'Investment',
    title: 'The Regenerative Agriculture Portfolio',
    narrative: `Develop a $15M impact investment portfolio focused on regenerative agriculture across three continents. Over six weeks, you'll visit ten farms and research stations—from organic vineyards in Tuscany to permaculture operations in New Zealand to carbon-sequestering ranches in Argentina. Each site visit includes meetings with agronomists, soil scientists, and farm operators, as well as financial due diligence sessions with impact investment analysts. You'll work with a team from the Yale Center for Business and the Environment to structure investments that balance financial returns (projected 8-12% annually) with measurable environmental outcomes (carbon capture, biodiversity, water quality). The final portfolio will be structured as a family fund with governance mechanisms for multi-generational stewardship.`,
    emotionalObjective: 'Align capital with environmental values while creating legacy asset',
    strategicReasoning: 'Legacy and security drivers support long-term, values-aligned investing; moderate risk tolerance fits impact investment risk profile; legacy planning stage indicates readiness for multi-generational structures',
    riskSummary: 'Moderate financial risk (early-stage agricultural ventures); operational complexity (international coordination); strong downside protection via diversification',
    discretionLevel: 'Standard',
    targetDrivers: ['legacy', 'security'],
    idealLifeStages: ['Legacy Planning', 'Preserving'],
  },
  {
    category: 'Travel',
    title: 'The Arctic Light Chronicles',
    narrative: `A twelve-day expedition to Svalbard, Norway, timed for the polar night—when the sun never rises. You'll stay at a remote research station normally reserved for climate scientists, joining ongoing studies of Arctic ecosystems and aurora phenomena. Days include snowmobile expeditions to glacier fronts, visits to the Global Seed Vault, and observation sessions where you'll photograph the northern lights under guidance from professional astrophotographers. You'll also participate in citizen science projects (ice core sampling, wildlife tracking) that contribute to polar research. Evenings feature presentations from resident scientists on climate systems, evolutionary biology, and polar exploration history. This is travel as education—a chance to witness one of Earth's most extreme environments while contributing to its understanding.`,
    emotionalObjective: 'Satisfy intellectual curiosity while experiencing extreme natural beauty',
    strategicReasoning: 'Adventure driver supports unique destination; legacy focus aligns with climate/preservation themes; recognition driver satisfied through contribution to scientific research',
    riskSummary: 'Low to moderate risk (extreme cold, remote location); excellent safety infrastructure (research station); requires cold tolerance and basic fitness',
    discretionLevel: 'Medium',
    targetDrivers: ['adventure', 'legacy', 'recognition'],
    idealLifeStages: ['Building', 'Preserving', 'Transitioning'],
  },
  {
    category: 'Family Education',
    title: 'The Generational Leadership Retreat',
    narrative: `A four-day family retreat in Aspen designed to prepare the next generation for stewardship of family wealth and values. Led by family governance experts from Cambridge Family Enterprise Group, the program includes workshops on financial literacy, philanthropic strategy, and conflict resolution. Your children (ages 16-28) will participate in peer discussions with other UHNI families, simulation exercises that model complex decisions, and one-on-one coaching sessions. You'll work together to draft a family mission statement and governance framework. The retreat balances structure (facilitated sessions) with informal connection (group hikes, shared meals). A family therapist is available throughout to address interpersonal dynamics. This is about building alignment and capability before it's needed—preparing heirs not just to inherit, but to lead.`,
    emotionalObjective: 'Ensure smooth intergenerational transition while preserving family cohesion',
    strategicReasoning: 'Legacy driver dominance indicates priority on succession; family education category directly addresses next-gen preparation; preserving/legacy planning stages suggest urgency',
    riskSummary: 'Low external risk; moderate emotional complexity (family dynamics); requires all participants to commit to vulnerability and honesty',
    discretionLevel: 'High',
    targetDrivers: ['legacy', 'security'],
    idealLifeStages: ['Legacy Planning', 'Preserving'],
  },
  {
    category: 'Concierge',
    title: 'The 48-Hour Impossible Request',
    narrative: `We handle whatever you need—with zero notice. Perhaps it's securing front-row seats to a sold-out premiere, chartering a helicopter for a same-day vineyard tour, or arranging a private dinner with a Michelin chef in your home. This isn't a pre-planned journey; it's an open invitation to test the boundaries of possibility. You provide the request; we provide the infrastructure, relationships, and execution. Our concierge team includes former diplomats, luxury hotel directors, and fixers with networks spanning 50+ countries. We've arranged private museum tours at 2 AM, sourced rare wines from closed estates, and coordinated multi-city itineraries with four hours' notice. This is about experiencing the feeling of "anything is possible"—because for you, it is.`,
    emotionalObjective: 'Experience absolute freedom and immediate gratification',
    strategicReasoning: 'High autonomy and recognition scores suggest desire for exceptional treatment; adventure driver supports spontaneity; this is pure luxury service—no deeper agenda required',
    riskSummary: 'Variable depending on request; logistical complexity high; financial cost unpredictable; reputational risk if requests conflict with values',
    discretionLevel: 'High',
    targetDrivers: ['autonomy', 'recognition', 'adventure'],
    idealLifeStages: ['Building', 'Preserving'],
  },
  {
    category: 'Estate Planning',
    title: 'The Dynastic Structure Design',
    narrative: `A six-month engagement with top estate planning attorneys, tax strategists, and family governance consultants to design a multi-generational wealth structure. This includes establishing a dynasty trust, creating a private trust company, structuring family investment entities across multiple jurisdictions, and implementing tax-efficient giving strategies. You'll work with specialists from Withers, Goulston & Storrs, and Geneva-based family offices. The process includes scenario modeling (estate tax impact, creditor protection, divorce protection), drafting comprehensive governance documents, and educating family members on their roles. This is technical, detail-oriented work—but the outcome is a framework that protects your wealth for centuries while maintaining flexibility for future generations to adapt. This is legacy in its most concrete form.`,
    emotionalObjective: 'Ensure wealth preservation and family autonomy across generations',
    strategicReasoning: 'Legacy and security drivers dominate; legacy planning stage indicates readiness; conservative risk tolerance supports robust protection structures; high discretion essential for estate planning',
    riskSummary: 'Low implementation risk (expert team); moderate complexity (multi-jurisdictional); requires disclosure of full financial picture to advisors',
    discretionLevel: 'High',
    targetDrivers: ['legacy', 'security', 'autonomy'],
    idealLifeStages: ['Legacy Planning', 'Preserving'],
  },
  {
    category: 'Travel',
    title: 'The Silent Temples Circuit',
    narrative: `Three weeks traversing the spiritual centers of Southeast Asia: Angkor Wat in Cambodia, Borobudur in Indonesia, Bagan in Myanmar, and lesser-known temple complexes accessible only by private arrangement. Each location includes private access during non-visiting hours—sunrise at Angkor with no other tourists, meditation at Borobudur before the gates open. You'll be accompanied by a scholar of comparative religion and a meditation teacher trained in Vipassana tradition. Days balance exploration (temple architecture, iconography, historical context) with contemplative practice (silent walking meditation, journaling, guided reflection). The journey concludes with a four-day silent retreat at a monastery in northern Thailand. This is not religious tourism—it's an investigation into the architectures of transcendence and the possibility of inner transformation through sustained attention.`,
    emotionalObjective: 'Explore spiritual frameworks and practices for meaning-making',
    strategicReasoning: 'Legacy and autonomy drivers suggest search for personal philosophy; transitioning life stage indicates openness to transformation; high discretion protects vulnerability during introspective journey',
    riskSummary: 'Low overall risk; moderate travel logistics (multiple countries); requires comfort with silence and introspection; some sites require moderate fitness',
    discretionLevel: 'High',
    targetDrivers: ['legacy', 'autonomy', 'adventure'],
    idealLifeStages: ['Transitioning', 'Legacy Planning'],
  },
];

/**
 * Generate 3-5 narrative journeys tailored to the user's intent profile.
 * Uses template matching based on emotional drivers and life stage.
 */
export async function generateNarrativeJourneys(
  intentProfile: IntentProfile
): Promise<Journey[]> {
  const journeyService = new MockJourneyService();

  // Score each template based on alignment with intent profile
  const scoredTemplates = NARRATIVE_TEMPLATES.map((template) => {
    let score = 0;

    // Match emotional drivers (weight heavily)
    template.targetDrivers.forEach((driver) => {
      score += intentProfile.emotionalDrivers[driver] * 2;
    });

    // Match life stage (weight moderately)
    if (template.idealLifeStages.includes(intentProfile.lifeStage)) {
      score += 100;
    }

    // Add small random factor for variety
    score += Math.random() * 20;

    return { template, score };
  });

  // Sort by score and take top 3-5
  scoredTemplates.sort((a, b) => b.score - a.score);
  const count = 3 + Math.floor(Math.random() * 3); // 3-5 journeys
  const selectedTemplates = scoredTemplates.slice(0, count).map((s) => s.template);

  // Create Journey entities from templates
  const journeys: Journey[] = [];

  for (const template of selectedTemplates) {
    const journey = await journeyService.createJourney({
      userId: intentProfile.userId,
      title: template.title,
      narrative: template.narrative,
      category: template.category,
      context: 'b2c',
    });

    // Update with additional fields not in CreateJourneyInput
    const enrichedJourney = await journeyService.updateJourney(journey.id, {
      emotionalObjective: template.emotionalObjective,
      strategicReasoning: template.strategicReasoning,
      riskSummary: template.riskSummary,
      discretionLevel: template.discretionLevel,
      status: JourneyStatus.DRAFT,
    });

    journeys.push(enrichedJourney);
  }

  return journeys;
}
