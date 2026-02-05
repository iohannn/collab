import React, { createContext, useContext, useState, useEffect } from 'react';

// Translations
const translations = {
  ro: {
    // Navigation
    nav: {
      home: 'Acasă',
      collaborations: 'Colaborări',
      influencers: 'Influenceri',
      pricing: 'Prețuri',
      login: 'Autentificare',
      register: 'Înregistrare',
      dashboard: 'Panou de control',
      logout: 'Deconectare',
      profile: 'Profil',
    },
    // Landing
    landing: {
      hero_title: 'Unde brandurile întâlnesc creatorii',
      hero_subtitle: 'Colaborări transparente. Prețuri clare. Închideri rapide.',
      cta_brand: 'Sunt Brand',
      cta_influencer: 'Sunt Creator',
      browse_collabs: 'Vezi colaborările',
      stats_collabs: 'Colaborări active',
      stats_influencers: 'Creatori înregistrați',
      stats_apps: 'Aplicații trimise',
      closing_soon: 'Se închide curând',
      applicants: 'aplicanți',
      view_all: 'Vezi toate',
      how_it_works: 'Cum funcționează',
      step1_title: 'Brandurile postează',
      step1_desc: 'Colaborări cu buget și deadline clar',
      step2_title: 'Creatorii aplică',
      step2_desc: 'Cu propunerea și prețul lor',
      step3_title: 'Match rapid',
      step3_desc: 'Colaborare închisă în 48h',
      trusted_by: 'Branduri care au colaborat',
    },
    // Auth
    auth: {
      login_title: 'Bine ai revenit',
      login_subtitle: 'Conectează-te pentru a continua',
      register_title: 'Creează cont',
      register_subtitle: 'Alătură-te pieței de colaborări',
      email: 'Email',
      password: 'Parolă',
      name: 'Nume complet',
      login_btn: 'Conectare',
      register_btn: 'Înregistrare',
      or: 'sau',
      google_login: 'Continuă cu Google',
      no_account: 'Nu ai cont?',
      has_account: 'Ai deja cont?',
      as_brand: 'Mă înregistrez ca Brand',
      as_influencer: 'Mă înregistrez ca Creator',
    },
    // Collaboration
    collab: {
      create_title: 'Creează colaborare',
      brand_name: 'Numele brandului',
      title: 'Titlu campanie',
      description: 'Descriere',
      deliverables: 'Livrabile',
      deliverables_placeholder: 'ex: 1 Reel, 2 Stories',
      budget: 'Buget',
      budget_min: 'Buget minim',
      budget_max: 'Buget maxim (opțional)',
      deadline: 'Deadline',
      platform: 'Platformă',
      creators_needed: 'Creatori necesari',
      create_btn: 'Publică colaborare',
      apply: 'Aplică',
      applied: 'Ai aplicat',
      message: 'Mesaj pentru brand',
      your_price: 'Prețul tău',
      select_deliverables: 'Selectează livrabile',
      send_application: 'Trimite aplicația',
      my_collabs: 'Colaborările mele',
      active: 'Active',
      closed: 'Închise',
      completed: 'Finalizate',
      applications: 'Aplicații',
      accept: 'Acceptă',
      reject: 'Respinge',
      pending: 'În așteptare',
      accepted: 'Acceptat',
      rejected: 'Respins',
      time_left: 'Timp rămas',
      days: 'zile',
      hours: 'ore',
      minutes: 'min',
    },
    // Influencer
    influencer: {
      profile_title: 'Profilul meu',
      username: 'Username',
      bio: 'Bio',
      niches: 'Nișe',
      platforms: 'Platforme',
      audience: 'Audiență',
      engagement: 'Engagement',
      price_post: 'Preț per postare',
      price_story: 'Preț per story',
      price_bundle: 'Preț pachet',
      save: 'Salvează',
      available: 'Disponibil pentru colaborări',
      my_apps: 'Aplicațiile mele',
      browse: 'Explorează colaborări',
    },
    // Pricing
    pricing: {
      title: 'Planuri',
      subtitle: 'Alege planul potrivit pentru tine',
      free: 'Gratuit',
      pro: 'PRO',
      featured: 'Featured',
      free_price: '0 €',
      pro_price: '29 €',
      featured_price: '9 €',
      per_month: '/lună',
      per_week: '/săptămână',
      free_features: ['3 colaborări active', 'Aplicații nelimitate', 'Profil public'],
      pro_features: ['Colaborări nelimitate', 'Vizibilitate prioritară', 'Badge PRO', 'Analiză avansată'],
      featured_features: ['7 zile featured', 'Top în căutări', 'Badge special'],
      current_plan: 'Planul actual',
      upgrade: 'Upgrade',
      get_featured: 'Obține Featured',
    },
    // Common
    common: {
      loading: 'Se încarcă...',
      error: 'Eroare',
      success: 'Succes',
      cancel: 'Anulează',
      save: 'Salvează',
      delete: 'Șterge',
      edit: 'Editează',
      view: 'Vezi',
      search: 'Caută',
      filter: 'Filtrează',
      all: 'Toate',
      eur: '€',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      collaborations: 'Collaborations',
      influencers: 'Influencers',
      pricing: 'Pricing',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      logout: 'Logout',
      profile: 'Profile',
    },
    // Landing
    landing: {
      hero_title: 'Where brands meet creators',
      hero_subtitle: 'Transparent collaborations. Clear pricing. Fast closes.',
      cta_brand: "I'm a Brand",
      cta_influencer: "I'm a Creator",
      browse_collabs: 'Browse collaborations',
      stats_collabs: 'Active collaborations',
      stats_influencers: 'Registered creators',
      stats_apps: 'Applications sent',
      closing_soon: 'Closing soon',
      applicants: 'applicants',
      view_all: 'View all',
      how_it_works: 'How it works',
      step1_title: 'Brands post',
      step1_desc: 'Collaborations with clear budget and deadline',
      step2_title: 'Creators apply',
      step2_desc: 'With their proposal and price',
      step3_title: 'Quick match',
      step3_desc: 'Collaboration closed in 48h',
      trusted_by: 'Brands that collaborated',
    },
    // Auth
    auth: {
      login_title: 'Welcome back',
      login_subtitle: 'Sign in to continue',
      register_title: 'Create account',
      register_subtitle: 'Join the collaboration marketplace',
      email: 'Email',
      password: 'Password',
      name: 'Full name',
      login_btn: 'Sign in',
      register_btn: 'Register',
      or: 'or',
      google_login: 'Continue with Google',
      no_account: "Don't have an account?",
      has_account: 'Already have an account?',
      as_brand: 'Register as Brand',
      as_influencer: 'Register as Creator',
    },
    // Collaboration
    collab: {
      create_title: 'Create collaboration',
      brand_name: 'Brand name',
      title: 'Campaign title',
      description: 'Description',
      deliverables: 'Deliverables',
      deliverables_placeholder: 'e.g., 1 Reel, 2 Stories',
      budget: 'Budget',
      budget_min: 'Min budget',
      budget_max: 'Max budget (optional)',
      deadline: 'Deadline',
      platform: 'Platform',
      creators_needed: 'Creators needed',
      create_btn: 'Publish collaboration',
      apply: 'Apply',
      applied: 'Applied',
      message: 'Message to brand',
      your_price: 'Your price',
      select_deliverables: 'Select deliverables',
      send_application: 'Send application',
      my_collabs: 'My collaborations',
      active: 'Active',
      closed: 'Closed',
      completed: 'Completed',
      applications: 'Applications',
      accept: 'Accept',
      reject: 'Reject',
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      time_left: 'Time left',
      days: 'days',
      hours: 'hours',
      minutes: 'min',
    },
    // Influencer
    influencer: {
      profile_title: 'My profile',
      username: 'Username',
      bio: 'Bio',
      niches: 'Niches',
      platforms: 'Platforms',
      audience: 'Audience',
      engagement: 'Engagement',
      price_post: 'Price per post',
      price_story: 'Price per story',
      price_bundle: 'Bundle price',
      save: 'Save',
      available: 'Available for collaborations',
      my_apps: 'My applications',
      browse: 'Browse collaborations',
    },
    // Pricing
    pricing: {
      title: 'Plans',
      subtitle: 'Choose the right plan for you',
      free: 'Free',
      pro: 'PRO',
      featured: 'Featured',
      free_price: '€0',
      pro_price: '€29',
      featured_price: '€9',
      per_month: '/month',
      per_week: '/week',
      free_features: ['3 active collaborations', 'Unlimited applications', 'Public profile'],
      pro_features: ['Unlimited collaborations', 'Priority visibility', 'PRO badge', 'Advanced analytics'],
      featured_features: ['7 days featured', 'Top in search', 'Special badge'],
      current_plan: 'Current plan',
      upgrade: 'Upgrade',
      get_featured: 'Get Featured',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      eur: '€',
    },
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('colaboreaza_lang');
    return saved || 'ro';
  });

  useEffect(() => {
    localStorage.setItem('colaboreaza_lang', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ro' ? 'en' : 'ro');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
