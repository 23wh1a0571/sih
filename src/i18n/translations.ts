export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface Translations {
  // Brand & General
  app_name: string;
  app_tagline: string;
  sih_badge: string;
  online_status: string;
  offline_status: string;
  pending_sync: string;
  restore_online: string;
  switch_role: string;
  sign_out: string;
  login: string;
  demo_tour: string;
  change_language: string;

  // Greetings & Time
  greeting_morning: string;
  greeting_afternoon: string;
  greeting_evening: string;
  greeting_night: string;
  shift_morning: string;
  shift_afternoon: string;
  shift_evening: string;
  shift_night: string;

  // Navigation
  nav_dashboard: string;
  nav_frontline_dashboard: string;
  nav_doctor_dashboard: string;
  nav_command_center: string;
  nav_healthcare_map: string;
  nav_register_patient: string;
  nav_ai_triage: string;
  nav_smart_referral: string;
  nav_referral_tracking: string;
  nav_patient_records: string;
  nav_followups: string;
  nav_teleconsultation: string;
  nav_notifications: string;
  nav_settings: string;

  // Action Buttons
  btn_explore_asha: string;
  btn_view_map: string;
  btn_login_portal: string;
  btn_launch_tour: string;
  btn_dispatch_ambulance: string;
  btn_create_referral: string;
  btn_view_record: string;
  btn_save_patient: string;
  btn_submit: string;
  btn_cancel: string;
  btn_next_step: string;
  btn_prev_step: string;
  btn_start_video_call: string;
  btn_sync_now: string;
  btn_emergency_sos: string;

  // Clinical & Triage
  triage_decision_support: string;
  risk_level: string;
  risk_low: string;
  risk_moderate: string;
  risk_high: string;
  risk_emergency: string;
  vitals_title: string;
  vital_temp: string;
  vital_bp: string;
  vital_hr: string;
  vital_spo2: string;
  symptoms: string;
  recommendation: string;
  missing_info: string;

  // Ambulance & Emergency
  ambulance_loading_title: string;
  ambulance_loading_sub: string;
  ambulance_corridor_active: string;
  emergency_lifeline: string;

  // Dashboard Metrics
  metric_patients_today: string;
  metric_emergency_cases: string;
  metric_pending_sync: string;
  metric_due_followups: string;
  metric_active_teleconsult: string;
  metric_bed_capacity: string;

  // Frontline Form
  form_patient_reg: string;
  form_full_name: string;
  form_age: string;
  form_gender: string;
  form_phone: string;
  form_village: string;
  form_symptoms_desc: string;
  form_voice_input: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    app_name: 'SwasthyaSetu AI',
    app_tagline: 'Emergency Rural Healthcare Continuity Platform',
    sih_badge: 'SIH26133 • National Emergency Network',
    online_status: 'Online (Cloud Connected)',
    offline_status: 'Offline (Local Safe Mode)',
    pending_sync: 'Pending Sync',
    restore_online: 'Restore Online & Sync',
    switch_role: 'Switch Role',
    sign_out: 'Sign Out',
    login: 'Login Portal',
    demo_tour: 'SIH Demo Tour',
    change_language: 'Language',

    greeting_morning: 'Good Morning',
    greeting_afternoon: 'Good Afternoon',
    greeting_evening: 'Good Evening',
    greeting_night: 'Good Night',
    shift_morning: 'Morning Emergency Duty',
    shift_afternoon: 'Afternoon Clinical Shift',
    shift_evening: 'Evening Triage Shift',
    shift_night: 'Night Emergency Roster',

    nav_dashboard: 'Dashboard',
    nav_frontline_dashboard: 'Frontline ASHA Console',
    nav_doctor_dashboard: 'Specialist Physician Console',
    nav_command_center: 'District Command Center',
    nav_healthcare_map: 'District Emergency GIS Map',
    nav_register_patient: '+ Register Patient',
    nav_ai_triage: 'AI Clinical Triage',
    nav_smart_referral: 'Smart Emergency Referral',
    nav_referral_tracking: 'Referral & Transit Tracking',
    nav_patient_records: 'Longitudinal EHR Records',
    nav_followups: 'Community Follow-ups',
    nav_teleconsultation: 'Teleconsultation Suite',
    nav_notifications: 'Emergency Alerts',
    nav_settings: 'ABDM Security & Settings',

    btn_explore_asha: 'ASHA Emergency View',
    btn_view_map: 'District GIS Map',
    btn_login_portal: 'Access Portal',
    btn_launch_tour: 'Start Emergency Tour',
    btn_dispatch_ambulance: '108 Ambulance Dispatch',
    btn_create_referral: 'Issue Smart Referral',
    btn_view_record: 'View Patient History',
    btn_save_patient: 'Save Clinical Record',
    btn_submit: 'Submit Evaluation',
    btn_cancel: 'Cancel',
    btn_next_step: 'Next Step',
    btn_prev_step: 'Previous Step',
    btn_start_video_call: 'Connect Specialist Video',
    btn_sync_now: 'Sync Offline Records',
    btn_emergency_sos: 'EMERGENCY 108 SOS',

    triage_decision_support: 'Clinical Decision Support',
    risk_level: 'Risk Stratification',
    risk_low: 'Low Risk (Routine Care)',
    risk_moderate: 'Moderate Risk (PHC Review)',
    risk_high: 'High Risk (Specialist Required)',
    risk_emergency: 'CRITICAL EMERGENCY (Immediate ALS Dispatch)',
    vitals_title: 'Real-Time Clinical Vitals',
    vital_temp: 'Temperature',
    vital_bp: 'Blood Pressure',
    vital_hr: 'Heart Rate',
    vital_spo2: 'Blood Oxygen (SpO2)',
    symptoms: 'Reported Symptoms',
    recommendation: 'AI Clinical Protocol Guidance',
    missing_info: 'Information Requiring Verification',

    ambulance_loading_title: '108 Emergency Ambulance Protocol Active',
    ambulance_loading_sub: 'Synchronizing critical telemetry with District Hospital Kurnool',
    ambulance_corridor_active: 'Green Corridor Alert Active',
    emergency_lifeline: 'National Rural Emergency Health Lifeline',

    metric_patients_today: 'Patients Triaged Today',
    metric_emergency_cases: 'Critical / Emergency Alerts',
    metric_pending_sync: 'Offline Records Pending Sync',
    metric_due_followups: 'High-Priority Follow-ups',
    metric_active_teleconsult: 'Specialist Consultations Active',
    metric_bed_capacity: 'ICU & Emergency Beds Free',

    form_patient_reg: 'Frontline Patient Clinical Registration',
    form_full_name: 'Patient Full Name',
    form_age: 'Age (Years)',
    form_gender: 'Gender',
    form_phone: 'Contact Phone Number',
    form_village: 'Village / Tribal Habitation',
    form_symptoms_desc: 'Describe Chief Complaint',
    form_voice_input: 'Vernacular Telugu / Hindi Voice Input',
  },

  te: {
    app_name: 'స్వాస్థ్యసేతు AI',
    app_tagline: 'గ్రామీణ అత్యవసర ఆరోగ్య సంరక్షణ నెట్‌వర్క్',
    sih_badge: 'SIH26133 • జాతీయ అత్యవసర వ్యవస్థ',
    online_status: 'ఆన్‌లైన్ (క్లౌడ్ కనెక్ట్ అయింది)',
    offline_status: 'ఆఫ్‌లైన్ (లోకల్ సురక్షిత మోడ్)',
    pending_sync: 'పెండింగ్ రికార్డులు',
    restore_online: 'ఆన్‌లైన్ పునరుద్ధరణ & సమకాలీకరణ',
    switch_role: 'పాత్ర మార్చండి',
    sign_out: 'లాగ్ అవుట్',
    login: 'లాగిన్ పోర్టల్',
    demo_tour: 'డెమో టూర్',
    change_language: 'భాష మార్చండి',

    greeting_morning: 'శుభోదయం',
    greeting_afternoon: 'శుభ మధ్యాహ్నం',
    greeting_evening: 'శుభ సాయంత్రం',
    greeting_night: 'శుభరాత్రి',
    shift_morning: 'ఉదయపు అత్యవసర డ్యూటీ',
    shift_afternoon: 'మధ్యాహ్న క్లినికల్ షిఫ్ట్',
    shift_evening: 'సాయంత్రం ట్రయేజ్ షిఫ్ట్',
    shift_night: 'రాత్రి అత్యవసర సేవలు',

    nav_dashboard: 'డాష్‌బోర్డ్',
    nav_frontline_dashboard: 'ఆశా కార్యకర్త డాష్‌బోర్డ్',
    nav_doctor_dashboard: 'వైద్య నిపుణుల పోర్టల్',
    nav_command_center: 'జిల్లా కమాండ్ సెంటర్',
    nav_healthcare_map: 'జిల్లా అత్యవసర GIS మ్యాప్',
    nav_register_patient: '+ రోగి నమోదు',
    nav_ai_triage: 'AI క్లినికల్ ట్రయేజ్',
    nav_smart_referral: 'స్మార్ట్ ఎమర్జెన్సీ రెఫరల్',
    nav_referral_tracking: 'రెఫరల్ & అంబులెన్స్ ట్రాకింగ్',
    nav_patient_records: 'రోగి ఆరోగ్య రికార్డులు (EHR)',
    nav_followups: 'గ్రామీణ ఫాలో-అప్‌లు',
    nav_teleconsultation: 'టెలికన్సల్టేషన్ గది',
    nav_notifications: 'అత్యవసర హెచ్చరికలు',
    nav_settings: 'ABDM భద్రత & సెట్టింగ్‌లు',

    btn_explore_asha: 'ఆశా కార్యకర్త వీక్షణ',
    btn_view_map: 'జిల్లా GIS మ్యాప్',
    btn_login_portal: 'లాగిన్ అవ్వండి',
    btn_launch_tour: 'టూర్ ప్రారంభించండి',
    btn_dispatch_ambulance: '108 అంబులెన్స్ పంపండి',
    btn_create_referral: 'స్మార్ట్ రెఫరల్ జారీ చేయండి',
    btn_view_record: 'రోగి వివరాలు చూడండి',
    btn_save_patient: 'రికార్డు భద్రపరచండి',
    btn_submit: 'సమర్పించండి',
    btn_cancel: 'రద్దు చేయండి',
    btn_next_step: 'తరువాతి దశ',
    btn_prev_step: 'మునుపటి దశ',
    btn_start_video_call: 'వీడియో కాల్ ప్రారంభించండి',
    btn_sync_now: 'క్లౌడ్ సమకాలీకరణ చేయండి',
    btn_emergency_sos: 'అత్యవసర 108 SOS',

    triage_decision_support: 'క్లినికల్ నిర్ణయ మద్దతు',
    risk_level: 'ప్రమాద తీవ్రత వర్గీకరణ',
    risk_low: 'తక్కువ ప్రమాదం (సాధారణ సంరక్షణ)',
    risk_moderate: 'మధ్యస్థ ప్రమాదం (PHC పరీక్ష అవసరం)',
    risk_high: 'అధిక ప్రమాదం (నిపుణుల వైద్యం తప్పనిసరి)',
    risk_emergency: 'తీవ్ర అత్యవసరం (తక్షణ 108 అంబులెన్స్)',
    vitals_title: 'రోగి కీలక ఆరోగ్య కొలతలు (Vitals)',
    vital_temp: 'శరీర ఉష్ణోగ్రత',
    vital_bp: 'రక్తపోటు (BP)',
    vital_hr: 'గుండె వేగం (HR)',
    vital_spo2: 'ఆక్సిజన్ స్థాయి (SpO2)',
    symptoms: 'బాధపడుతున్న లక్షణాలు',
    recommendation: 'AI చికిత్సా మార్గదర్శకాలు',
    missing_info: 'పరిశీలించవలసిన అదనపు సమాచారం',

    ambulance_loading_title: '108 అత్యవసర అంబులెన్స్ ప్రోటోకాల్ సక్రియం',
    ambulance_loading_sub: 'కర్నూలు జిల్లా ఆసుపత్రితో కీలక సమాచార సమకాలీకరణ',
    ambulance_corridor_active: 'గ్రీన్ కారిడార్ హెచ్చరిక సక్రియం',
    emergency_lifeline: 'జాతీయ గ్రామీణ అత్యవసర ఆరోగ్య జీవనరేఖ',

    metric_patients_today: 'ఈ రోజు చూసిన రోగులు',
    metric_emergency_cases: 'అత్యవసర కేసులు',
    metric_pending_sync: 'ఆఫ్‌లైన్ పెండింగ్ రికార్డులు',
    metric_due_followups: 'చేయవలసిన ఫాలో-అప్‌లు',
    metric_active_teleconsult: 'వీడియో సంప్రదింపులు',
    metric_bed_capacity: 'అందుబాటులో ఉన్న ICU బెడ్లు',

    form_patient_reg: 'కొత్త రోగి క్లినికల్ నమోదు',
    form_full_name: 'రోగి పూర్తి పేరు',
    form_age: 'వయస్సు (సంవత్సరాలు)',
    form_gender: 'లింగం',
    form_phone: 'ఫోన్ నంబర్',
    form_village: 'గ్రామం / నివాసం',
    form_symptoms_desc: 'ప్రధాన వ్యాధి లక్షణాలు వివరించండి',
    form_voice_input: 'తెలుగు వాయిస్ రికార్డింగ్ ఇన్పుట్',
  },

  hi: {
    app_name: 'स्वास्थ्यसेतु AI',
    app_tagline: 'ग्रामीण आपातकालीन स्वास्थ्य निरंतरता मंच',
    sih_badge: 'SIH26133 • राष्ट्रीय आपातकालीन नेटवर्क',
    online_status: 'ऑनलाइन (क्लाउड से जुड़ा हुआ)',
    offline_status: 'ऑफलाइन (स्थानीय सुरक्षित मोड)',
    pending_sync: 'लंबित रिकॉर्ड',
    restore_online: 'ऑनलाइन बहाल करें और सिंक करें',
    switch_role: 'भूमिका बदलें',
    sign_out: 'साइन आउट',
    login: 'लॉगिन पोर्टल',
    demo_tour: 'डेमो टूर',
    change_language: 'भाषा बदलें',

    greeting_morning: 'सुप्रभात',
    greeting_afternoon: 'शुभ दोपहर',
    greeting_evening: 'शुभ संध्या',
    greeting_night: 'शुभ रात्रि',
    shift_morning: 'सुबह की आपातकालीन ड्यूटी',
    shift_afternoon: 'दोपहर की नैदानिक पारी',
    shift_evening: 'शाम की ट्राइएज ड्यूटी',
    shift_night: 'रात्रि आपातकालीन सेवा',

    nav_dashboard: 'डैशबोर्ड',
    nav_frontline_dashboard: 'आशा कार्यकर्ता कंसोल',
    nav_doctor_dashboard: 'विशेषज्ञ चिकित्सक पोर्टल',
    nav_command_center: 'जिला कमांड सेंटर',
    nav_healthcare_map: 'जिला आपातकालीन जीआईएस मानचित्र',
    nav_register_patient: '+ मरीज पंजीकरण',
    nav_ai_triage: 'एआई नैदानिक ट्राइएज',
    nav_smart_referral: 'स्मार्ट आपातकालीन रेफरल',
    nav_referral_tracking: 'रेफरल और एम्बुलेंस ट्रैकिंग',
    nav_patient_records: 'मरीज स्वास्थ्य रिकॉर्ड (EHR)',
    nav_followups: 'सामुदायिक अनुवर्ती देखभाल',
    nav_teleconsultation: 'टेलीकंसल्टेशन रूम',
    nav_notifications: 'आपातकालीन अलर्ट',
    nav_settings: 'एबीडीएम सुरक्षा और सेटिंग्स',

    btn_explore_asha: 'आशा कार्यकर्ता दृश्य',
    btn_view_map: 'जिला जीआईएस मानचित्र',
    btn_login_portal: 'पोर्टल लॉगिन',
    btn_launch_tour: 'टूर शुरू करें',
    btn_dispatch_ambulance: '108 एम्बुलेंस भेजें',
    btn_create_referral: 'स्मार्ट रेफरल जारी करें',
    btn_view_record: 'मरीज का इतिहास देखें',
    btn_save_patient: 'रिकॉर्ड सुरक्षित करें',
    btn_submit: 'जमा करें',
    btn_cancel: 'रद्द करें',
    btn_next_step: 'अगला चरण',
    btn_prev_step: 'पिछला चरण',
    btn_start_video_call: 'विशेषज्ञ वीडियो कॉल शुरू करें',
    btn_sync_now: 'ऑफलाइन रिकॉर्ड सिंक करें',
    btn_emergency_sos: 'आपातकालीन 108 एसओएस',

    triage_decision_support: 'क्लिनिकल निर्णय समर्थन प्रणाली',
    risk_level: 'जोखिम स्तरीकरण',
    risk_low: 'कम जोखिम (नियमित देखभाल)',
    risk_moderate: 'मध्यम जोखिम (पीएचसी जांच आवश्यक)',
    risk_high: 'उच्च जोखिम (विशेषज्ञ उपचार अनिवार्य)',
    risk_emergency: 'गंभीर आपातकाल (तत्काल 108 एम्बुलेंस आवश्यक)',
    vitals_title: 'मरीज के महत्वपूर्ण पैरामीटर (Vitals)',
    vital_temp: 'तापमान',
    vital_bp: 'रक्तचाप (BP)',
    vital_hr: 'हृदय गति (Heart Rate)',
    vital_spo2: 'ऑक्सीजन स्तर (SpO2)',
    symptoms: 'प्रमुख लक्षण',
    recommendation: 'एआई नैदानिक प्रोटोकॉल मार्गदर्शन',
    missing_info: 'सत्यापन योग्य अतिरिक्त जानकारी',

    ambulance_loading_title: '108 आपातकालीन एम्बुलेंस प्रोटोकॉल सक्रिय',
    ambulance_loading_sub: 'कुरनूल जिला अस्पताल के साथ आवश्यक डेटा का सिंक',
    ambulance_corridor_active: 'ग्रीन कॉरिडोर अलर्ट सक्रिय',
    emergency_lifeline: 'राष्ट्रीय ग्रामीण आपातकालीन स्वास्थ्य जीवनरेखा',

    metric_patients_today: 'आज जांचे गए मरीज',
    metric_emergency_cases: 'गंभीर / आपातकालीन अलर्ट',
    metric_pending_sync: 'ऑफलाइन लंबित रिकॉर्ड',
    metric_due_followups: 'लंबित अनुवर्ती देखभाल',
    metric_active_teleconsult: 'सक्रिय टेलीकंसल्टेशन',
    metric_bed_capacity: 'उपलब्ध आईसीयू और आपातकालीन बेड',

    form_patient_reg: 'नया मरीज नैदानिक पंजीकरण',
    form_full_name: 'मरीज का पूरा नाम',
    form_age: 'उम्र (वर्ष)',
    form_gender: 'लिंग',
    form_phone: 'संपर्क फोन नंबर',
    form_village: 'गाँव / आदिवासी क्षेत्र',
    form_symptoms_desc: 'प्रमुख लक्षणों का विवरण',
    form_voice_input: 'हिंदी वॉइस रिकॉर्डिंग इनपुट',
  },
};
