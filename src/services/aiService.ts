import type { Vitals, RiskLevel, Language, QualityAlert } from '../types';

export interface VoiceExtractionResult {
  detectedLanguage: Language;
  languageName: string;
  transcript: string;
  englishTranslation: string;
  vernacularExplanation: string;
  structuredSymptoms: {
    fever: string | null;
    headache: boolean;
    vomiting: boolean;
    cough: boolean;
    chestPain: boolean;
    duration: string;
    additionalNotes: string;
  };
  symptomTags: string[];
}

export interface TriageEvaluation {
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  suggestedAction: string;
  recommendedFacility: string;
  urgencyTimeline: string;
  missingInformation: string[];
  keyRiskFactors: string[];
  disclaimer: string;
}

export interface PatientBrief {
  summary: string;
  vitalsAnalysis: string;
  clinicalConcern: string;
  recommendedFocus: string[];
  disclaimer: string;
}

class AIService {
  /**
   * Voice recognition & Multilingual Symptom Extraction
   * Simulates Speech-to-Text and NLP symptom extraction for Telugu, Hindi, and English.
   * Can be configured to hook into an LLM or Web Speech API.
   */
  async processVoiceInput(audioTranscript: string, selectedLang: Language = 'te'): Promise<VoiceExtractionResult> {
    // Artificial latency to simulate fast AI edge inference
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lower = audioTranscript.toLowerCase();

    // Check language cues or defaults
    let detected: Language = selectedLang;
    if (/జ్వరం|తలనొప్పి|వాంతులు|రోజులు|కడుపునొప్పి/.test(audioTranscript)) {
      detected = 'te';
    } else if (/बुखार|सिरदर्द|उल्टी|दिन|दर्द/.test(audioTranscript)) {
      detected = 'hi';
    } else if (/fever|headache|vomiting|pain|days/.test(lower)) {
      detected = 'en';
    }

    const langNames: Record<Language, string> = {
      en: 'English',
      te: 'Telugu (తెలుగు)',
      hi: 'Hindi (हिन्दी)',
    };

    // Extract symptoms
    const hasFever = /జ్వరం|बुखार|fever|temperature/i.test(audioTranscript);
    const hasHeadache = /తలనొప్పి|सिरदर्द|headache/i.test(audioTranscript);
    const hasVomiting = /వాంతులు|उल्टी|vomit/i.test(audioTranscript);
    const hasCough = /దగ్గు|खांसी|cough/i.test(audioTranscript);
    const hasChestPain = /ఛాతీ|छाती|chest/i.test(audioTranscript);

    let duration = '3 days';
    if (/మూడు రోజులు|तीन दिन|3 days|3 day/i.test(audioTranscript)) {
      duration = '3 days';
    } else if (/రెండు రోజులు|दो दिन|2 days/i.test(audioTranscript)) {
      duration = '2 days';
    } else if (/వారం|सप्ताह|week/i.test(audioTranscript)) {
      duration = '7 days';
    }

    const symptomTags: string[] = [];
    if (hasFever) symptomTags.push(`Fever (${duration})`);
    if (hasHeadache) symptomTags.push('Headache');
    if (hasVomiting) symptomTags.push('Vomiting');
    if (hasCough) symptomTags.push('Cough');
    if (hasChestPain) symptomTags.push('Chest Discomfort');

    let englishTranslation = 'Patient reports having a fever for three days accompanied by headache and vomiting.';
    let vernacularExplanation = 'రోగికి 3 రోజులుగా జ్వరం ఉంది. తలనొప్పి మరియు వాంతులు ఉన్నాయి. తక్షణమే ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) వైద్యుడిని సంప్రదించాలి.';

    if (detected === 'hi') {
      englishTranslation = 'Patient reports high fever for three days with persistent headache and repeated vomiting.';
      vernacularExplanation = 'मरीज को 3 दिनों से तेज बुखार है, साथ में सिरदर्द और उल्टियां हो रही हैं। प्राथमिक स्वास्थ्य केंद्र (PHC) में जांच की सलाह दी जाती है।';
    } else if (detected === 'en') {
      vernacularExplanation = 'రోగికి మూడు రోజుల పాటు జ్వరం, తలనొప్పి, వాంతులు ఉన్నాయి.';
    }

    return {
      detectedLanguage: detected,
      languageName: langNames[detected],
      transcript: audioTranscript,
      englishTranslation,
      vernacularExplanation,
      structuredSymptoms: {
        fever: hasFever ? duration : null,
        headache: hasHeadache,
        vomiting: hasVomiting,
        cough: hasCough,
        chestPain: hasChestPain,
        duration,
        additionalNotes: 'Reported via Frontline Worker ASHA Voice Interface.',
      },
      symptomTags,
    };
  }

  /**
   * AI-Assisted Triage & Risk Stratification
   * Decision support for frontline health workers based on vitals, red flags, and duration.
   */
  evaluateTriage(
    symptoms: string[],
    vitals: Vitals,
    age: number,
    existingConditions: string[] = []
  ): TriageEvaluation {
    let riskScore = 20;
    const keyRiskFactors: string[] = [];
    const missingInfo: string[] = [];

    // Vital signs assessment
    if (vitals.temperature >= 103) {
      riskScore += 35;
      keyRiskFactors.push(`High grade fever (${vitals.temperature}°F)`);
    } else if (vitals.temperature >= 100.4) {
      riskScore += 20;
      keyRiskFactors.push(`Pyrexia / Elevated temperature (${vitals.temperature}°F)`);
    }

    if (vitals.spo2 < 94) {
      riskScore += 45;
      keyRiskFactors.push(`Hypoxemia / Low SpO2 (${vitals.spo2}%)`);
    } else if (vitals.spo2 < 96) {
      riskScore += 15;
      keyRiskFactors.push(`Borderline SpO2 (${vitals.spo2}%)`);
    }

    const [systolic, diastolic] = vitals.bloodPressure.split('/').map((n) => parseInt(n.trim(), 10));
    if (systolic >= 160 || diastolic >= 100) {
      riskScore += 30;
      keyRiskFactors.push(`Stage 2 Hypertension (${vitals.bloodPressure})`);
    } else if (systolic >= 140 || diastolic >= 90) {
      riskScore += 15;
      keyRiskFactors.push(`Elevated Blood Pressure (${vitals.bloodPressure})`);
    }

    // Symptom complexity
    const symLower = symptoms.map((s) => s.toLowerCase());
    if (symLower.some((s) => s.includes('chest') || s.includes('breathlessness'))) {
      riskScore += 40;
      keyRiskFactors.push('Cardiorespiratory distress symptom detected');
    }
    if (symLower.some((s) => s.includes('vomit')) && vitals.temperature >= 101) {
      riskScore += 15;
      keyRiskFactors.push('Fever with recurrent vomiting (dehydration risk)');
    }

    // Age factor
    if (age > 60 || age < 5) {
      riskScore += 10;
      keyRiskFactors.push(`Vulnerable age bracket (${age} years)`);
    }

    // Missing information check
    if (!existingConditions || existingConditions.length === 0) {
      missingInfo.push('Prior chronic disease history not recorded');
    }
    missingInfo.push('Current medication adherence history');
    missingInfo.push('Recent travel or exposure history');

    // Risk Level Stratification
    let riskLevel: RiskLevel = 'Low';
    let suggestedAction = 'Home care guidance with hydration. Routine follow-up in 48 hours.';
    let recommendedFacility = 'Sub-Centre Community Follow-up';
    let urgencyTimeline = 'Within 48 hours';

    if (riskScore >= 75) {
      riskLevel = 'Emergency';
      suggestedAction = 'Immediate stabilization and expedited emergency transport to District Hospital.';
      recommendedFacility = 'District Hospital - Emergency Department';
      urgencyTimeline = 'Immediate (< 1 hour)';
    } else if (riskScore >= 50) {
      riskLevel = 'High';
      suggestedAction = 'Priority medical evaluation by Medical Officer. Prepare smart referral.';
      recommendedFacility = 'Community Health Centre / First Referral Unit';
      urgencyTimeline = 'Within 6 hours';
    } else if (riskScore >= 30) {
      riskLevel = 'Moderate';
      suggestedAction = 'Recommend evaluation at the Primary Health Centre (PHC) for clinical assessment and diagnostic testing.';
      recommendedFacility = 'Primary Health Centre (PHC)';
      urgencyTimeline = 'Same day (within 24 hours)';
    }

    return {
      riskLevel,
      riskScore: Math.min(100, riskScore),
      suggestedAction,
      recommendedFacility,
      urgencyTimeline,
      missingInformation: missingInfo,
      keyRiskFactors,
      disclaimer:
        'AI-assisted decision support only. This does not constitute a medical diagnosis. Final clinical assessment, diagnostic workup, and treatment decisions must be performed by a qualified healthcare professional.',
    };
  }

  /**
   * Generates AI Patient Brief for Doctor / Specialist
   * Saves physician time during referral evaluation & teleconsultation.
   */
  generateDoctorBrief(
    patientName: string,
    age: number,
    symptoms: string[],
    duration: string,
    vitals: Vitals,
    existingConditions: string[] = [],
    referralReason: string = 'Further clinical evaluation'
  ): PatientBrief {
    const vitalsStr = `Temperature: ${vitals.temperature}°F, BP: ${vitals.bloodPressure} mmHg, HR: ${vitals.heartRate} bpm, SpO2: ${vitals.spo2}%`;
    const conditionsStr = existingConditions.length > 0 ? existingConditions.join(', ') : 'No documented chronic conditions';

    const summary = `${patientName}, a ${age}-year-old individual, presents with ${symptoms.join(', ')} persisting for ${duration}. Vitals recorded at frontline triage: ${vitalsStr}. Prior history indicates ${conditionsStr.toLowerCase()}. Referred for: ${referralReason}.`;

    let vitalsAnalysis = 'Vitals indicate moderate pyrexia and stable oxygen saturation.';
    if (vitals.temperature >= 102) {
      vitalsAnalysis = 'Significant pyrexia noted (102°F+). Patient may require empirical antipyretic management and hydration assessment.';
    }

    return {
      summary,
      vitalsAnalysis,
      clinicalConcern: 'Evaluation required to differentiate acute febrile illness (e.g., viral vs. bacterial/vector-borne) and manage dehydration risk.',
      recommendedFocus: [
        'Confirm duration and onset pattern of fever spikes',
        'Check for signs of meningism or severe dehydration',
        'Review basic blood count (CBC/Hemogram) or rapid malaria/dengue screening if indicated',
        'Verify patient allergies prior to medication prescription',
      ],
      disclaimer:
        'AI-generated summary. Verify all vital parameters and patient statements before making clinical decisions.',
    };
  }

  /**
   * Generate District Healthcare Quality Alerts
   */
  getQualityAlerts(): QualityAlert[] {
    return [
      {
        id: 'qa-1',
        type: 'critical',
        severityTag: '🔴',
        title: 'High Referral Delay at PHC B (Kurnool Rural)',
        description:
          'Average referral transit time has surged to 8.2 hrs (district benchmark: 4.0 hrs). 12 pending patient transfers awaiting ambulance coordination.',
        facilityId: 'fac-phc-b',
        timestamp: '28 mins ago',
      },
      {
        id: 'qa-2',
        type: 'warning',
        severityTag: '🟠',
        title: 'Declining Follow-up Completion in Venkatapuram Village',
        description:
          'Community follow-up rate dropped to 68% (down 18% month-over-month). High volume of hypertensive patients missing 14-day vital checks.',
        facilityId: 'fac-sub-venkatapuram',
        timestamp: '2 hours ago',
      },
      {
        id: 'qa-3',
        type: 'warning',
        severityTag: '🟡',
        title: '18 Referrals Pending for >24 Hours',
        description:
          'Specialist queue bottleneck in General Medicine & Orthopedics at Kurnool District Hospital. Immediate triage reallocation suggested.',
        facilityId: 'fac-dh-kurnool',
        timestamp: '4 hours ago',
      },
      {
        id: 'qa-4',
        type: 'success',
        severityTag: '🟢',
        title: 'PHC C Improved Referral Resolution by 14%',
        description:
          'Teleconsultation adoption in PHC C resolved 42 non-critical cases locally, reducing unnecessary physical travel to the district hospital.',
        facilityId: 'fac-phc-c',
        timestamp: '1 day ago',
      },
    ];
  }
}

export const aiService = new AIService();
