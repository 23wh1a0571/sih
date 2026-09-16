import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService, VoiceExtractionResult } from '../../services/aiService';
import { Language } from '../../types';
import {
  Mic,
  MicOff,
  Volume2,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Languages,
  RotateCcw,
  AudioWaveform as Waveform,
} from 'lucide-react';

interface VoiceAssistantProps {
  onApplyExtractedData?: (data: {
    symptoms: string[];
    duration: string;
    description: string;
    language: Language;
  }) => void;
}

export const MultilingualVoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onApplyExtractedData,
}) => {
  const { language, setLanguage, showToast } = useApp();
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<Language>(language || 'te');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioResult, setAudioResult] = useState<VoiceExtractionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'structured' | 'translation' | 'explanation'>(
    'structured'
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const PRESETS: Record<Language, { text: string; label: string }> = {
    te: {
      text: 'నాకు మూడు రోజులుగా జ్వరం ఉంది, తలనొప్పి మరియు వాంతులు ఉన్నాయి.',
      label: 'Sample Telugu Frontline Patient Voice',
    },
    hi: {
      text: 'मुझे तीन दिन से तेज बुखार है, सिरदर्द और उल्टियां हो रही हैं।',
      label: 'Sample Hindi Patient Speech',
    },
    en: {
      text: 'I have had a high fever for three days with persistent headache and vomiting.',
      label: 'Sample English Clinical Statement',
    },
  };

  const handleSimulateVoice = async (textToProcess?: string) => {
    setIsListening(true);
    const speech = textToProcess || PRESETS[selectedVoiceLang].text;

    // Simulate 1.2s of audio listening animation
    setTimeout(async () => {
      setIsListening(false);
      setIsProcessing(true);

      try {
        const result = await aiService.processVoiceInput(speech, selectedVoiceLang);
        setAudioResult(result);
        showToast(
          `AI Voice Processed: Detected ${result.languageName} with ${result.symptomTags.length} clinical symptoms`,
          'success'
        );
      } catch (err) {
        showToast('Error processing voice audio', 'error');
      } finally {
        setIsProcessing(false);
      }
    }, 1400);
  };

  const handleApplyToForm = () => {
    if (!audioResult) return;
    if (onApplyExtractedData) {
      onApplyExtractedData({
        symptoms: audioResult.symptomTags,
        duration: audioResult.structuredSymptoms.duration,
        description: audioResult.englishTranslation,
        language: audioResult.detectedLanguage,
      });
      showToast('Extracted symptoms populated into patient registration fields', 'success');
    }
  };

  const handleSimulateSpeechAudio = () => {
    setIsPlayingAudio(true);
    // Use Web Speech API synthesis if available, or simulate
    if ('speechSynthesis' in window) {
      const textToSpeak =
        activeTab === 'translation'
          ? audioResult?.englishTranslation || ''
          : audioResult?.vernacularExplanation || audioResult?.transcript || '';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50/70 via-white to-indigo-50/50 rounded-2xl border border-teal-200/80 shadow-md p-5 md:p-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-teal-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-2">
              Multilingual Health Voice Assistant
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                AI NLP
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Assists ASHA/ANM frontline workers in capturing patient symptoms in vernacular languages
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex items-center gap-1.5 p-1 bg-white/90 border border-slate-200 rounded-xl shadow-xs self-stretch sm:self-auto justify-center">
          <button
            onClick={() => {
              setSelectedVoiceLang('te');
              setLanguage('te');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedVoiceLang === 'te'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            తెలుగు (Telugu)
          </button>
          <button
            onClick={() => {
              setSelectedVoiceLang('hi');
              setLanguage('hi');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedVoiceLang === 'hi'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            हिन्दी (Hindi)
          </button>
          <button
            onClick={() => {
              setSelectedVoiceLang('en');
              setLanguage('en');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedVoiceLang === 'en'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Voice Trigger and Audio Visualizer */}
      <div className="my-5 flex flex-col items-center justify-center p-6 rounded-xl bg-white/80 border border-slate-200/90 shadow-xs">
        {/* Animated Microphone Button */}
        <div className="relative mb-3">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
          )}
          <button
            onClick={() => handleSimulateVoice()}
            disabled={isListening || isProcessing}
            className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
              isListening
                ? 'bg-rose-500 text-white scale-110 shadow-rose-500/40'
                : isProcessing
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105 shadow-teal-600/30'
            }`}
            title="Tap to speak"
          >
            {isListening ? (
              <MicOff className="w-7 h-7 animate-bounce" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </button>
        </div>

        <p className="text-sm font-semibold text-slate-800 mb-1">
          {isListening
            ? 'Listening to Patient Voice in ' + (selectedVoiceLang === 'te' ? 'Telugu' : selectedVoiceLang === 'hi' ? 'Hindi' : 'English') + '...'
            : isProcessing
            ? 'AI Extracting Clinical Symptoms...'
            : 'Tap to speak or test simulated vernacular speech'}
        </p>

        {/* Audio Wave Simulation */}
        {isListening && (
          <div className="flex items-center gap-1.5 my-3 h-8">
            <span className="w-1 bg-teal-500 rounded-full wave-bar" style={{ animationDelay: '0.1s' }} />
            <span className="w-1 bg-teal-600 rounded-full wave-bar" style={{ animationDelay: '0.3s' }} />
            <span className="w-1 bg-teal-500 rounded-full wave-bar" style={{ animationDelay: '0.2s' }} />
            <span className="w-1 bg-teal-700 rounded-full wave-bar" style={{ animationDelay: '0.4s' }} />
            <span className="w-1 bg-teal-600 rounded-full wave-bar" style={{ animationDelay: '0.15s' }} />
          </div>
        )}

        {/* Quick Sample Voice Clicker */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Demo Preset:</span>
          <button
            onClick={() => handleSimulateVoice(PRESETS[selectedVoiceLang].text)}
            className="text-xs bg-slate-100 hover:bg-teal-50 text-teal-800 border border-slate-200 hover:border-teal-300 font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span className="italic truncate max-w-xs">"{PRESETS[selectedVoiceLang].text}"</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 text-teal-600" />
          </button>
        </div>
      </div>

      {/* AI Extraction Display */}
      {audioResult && (
        <div className="bg-white rounded-xl border border-teal-200 shadow-xs overflow-hidden transition-all animate-in fade-in">
          {/* Subheader */}
          <div className="bg-teal-50/70 px-4 py-3 border-b border-teal-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                Detected: {audioResult.languageName}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('structured')}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeTab === 'structured'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:bg-teal-100/60'
                }`}
              >
                Extracted Symptoms
              </button>
              <button
                onClick={() => setActiveTab('translation')}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeTab === 'translation'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:bg-teal-100/60'
                }`}
              >
                Translate to English
              </button>
              <button
                onClick={() => setActiveTab('explanation')}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeTab === 'explanation'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:bg-teal-100/60'
                }`}
              >
                Explain in {selectedVoiceLang === 'te' ? 'Telugu' : selectedVoiceLang === 'hi' ? 'Hindi' : 'Local Language'}
              </button>
            </div>
          </div>

          <div className="p-4 md:p-5">
            {/* Tab 1: Structured Information */}
            {activeTab === 'structured' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold mb-1">Transcript Recorded:</p>
                  <p className="text-sm font-medium text-slate-800 italic">
                    "{audioResult.transcript}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                    <p className="text-xs text-amber-700 font-bold uppercase">Fever</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {audioResult.structuredSymptoms.fever ? `${audioResult.structuredSymptoms.fever} duration` : 'None detected'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200">
                    <p className="text-xs text-teal-700 font-bold uppercase">Headache</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {audioResult.structuredSymptoms.headache ? 'Reported (Yes)' : 'No'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                    <p className="text-xs text-purple-700 font-bold uppercase">Vomiting</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {audioResult.structuredSymptoms.vomiting ? 'Reported (Yes)' : 'No'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-slate-500 font-semibold">Normalized Clinical Tags:</span>
                  {audioResult.symptomTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: English Translation */}
            {activeTab === 'translation' && (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Standardized English Translation (For Doctor / Specialist)
                    </span>
                    <button
                      onClick={handleSimulateSpeechAudio}
                      className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlayingAudio ? 'Reading...' : 'Listen'}</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {audioResult.englishTranslation}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  Helps non-vernacular speaking doctors at District Hospital understand frontline patient complaints without misunderstanding.
                </p>
              </div>
            )}

            {/* Tab 3: Vernacular Explanation */}
            {activeTab === 'explanation' && (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      Local Vernacular Communication
                    </span>
                    <button
                      onClick={handleSimulateSpeechAudio}
                      className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-medium"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlayingAudio ? 'Speaking...' : 'Play Vernacular Voice'}</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium font-sans">
                    {audioResult.vernacularExplanation}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  Simplifies clinical next steps into clear local language instructions for the patient and their family.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-500 italic">
                Extracted via SwasthyaSetu Multilingual Speech Engine
              </span>

              {onApplyExtractedData && (
                <button
                  onClick={handleApplyToForm}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply Extracted Data to Patient Form</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
