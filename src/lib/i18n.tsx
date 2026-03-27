import React, { createContext, useContext, useState } from "react";

type Locale = "en" | "es" | "pt" | "kea" | "fr";

interface Translations {
  [key: string]: string;
}

const translations: Record<Locale, Translations> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.chat": "Chat",
    "nav.credit": "Credit",
    "nav.dashboard": "Dashboard",
    "nav.documents": "Documents",
    "nav.resources": "Resources",
    "nav.signin": "Sign In",
    "nav.signup": "Get Started",
    "nav.signout": "Sign Out",

    // Landing
    "hero.title": "Get Your Family Mortgage-Ready",
    "hero.subtitle":
      "Upload your credit report. Our AI analyzes it, writes dispute letters, and creates your personalized 90-day mortgage readiness plan.",
    "hero.cta": "Start for Free",
    "hero.secondary": "See How It Works",
    "hero.trusted": "Trusted by immigrant families across Massachusetts",

    // Features
    "features.title": "Everything You Need to Get Mortgage-Ready",
    "features.subtitle":
      "One credit report. Complete AI-powered mortgage readiness.",

    // How it works
    "how.title": "How It Works",
    "how.step1.title": "Upload Your Credit Report",
    "how.step1.desc": "Upload your PDF credit report. We support all 3 bureaus.",
    "how.step2.title": "AI Analyzes Everything",
    "how.step2.desc":
      "Our AI reads every line, finds every issue, and explains it in plain language.",
    "how.step3.title": "Get Your Plan",
    "how.step3.desc":
      "Receive dispute letters, a 90-day action plan, and your mortgage readiness score.",

    // Auth
    "auth.signin.title": "Welcome back",
    "auth.signin.subtitle": "Sign in to your Morabeza account",
    "auth.signup.title": "Get mortgage-ready",
    "auth.signup.subtitle": "Create your free Morabeza account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullname": "Full Name",
    "auth.signin.button": "Sign In",
    "auth.signup.button": "Create Account",
    "auth.google": "Continue with Google",
    "auth.no_account": "Don't have an account?",
    "auth.have_account": "Already have an account?",
    "auth.check_email": "Check your email to confirm your account.",

    // Upload
    "upload.title": "Upload Your Credit Report",
    "upload.subtitle":
      "Upload your PDF credit report and our AI will analyze it instantly.",
    "upload.drag": "Drag and drop your PDF here",
    "upload.or": "or",
    "upload.browse": "Browse files",
    "upload.analyzing": "Analyzing your credit report...",
    "upload.success": "Analysis complete!",

    // Dashboard
    "dashboard.title": "Your Mortgage Readiness",
    "dashboard.score": "Readiness Score",
    "dashboard.credit": "Credit Summary",
    "dashboard.disputes": "Dispute Letters",
    "dashboard.plan": "Action Plan",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong. Please try again.",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.next": "Next",
    "common.back": "Back",
    "common.download": "Download",
    "common.copy": "Copy",
    "common.copied": "Copied!",
  },
  es: {
    // Nav
    "nav.home": "Inicio",
    "nav.chat": "Chat",
    "nav.credit": "Crédito",
    "nav.dashboard": "Panel",
    "nav.documents": "Documentos",
    "nav.resources": "Recursos",
    "nav.signin": "Iniciar Sesión",
    "nav.signup": "Empezar",
    "nav.signout": "Cerrar Sesión",

    // Landing
    "hero.title": "Prepara a Tu Familia para la Hipoteca",
    "hero.subtitle":
      "Sube tu reporte de crédito. Nuestra IA lo analiza, escribe cartas de disputa y crea tu plan personalizado de 90 días.",
    "hero.cta": "Comenzar Gratis",
    "hero.secondary": "Ver Cómo Funciona",
    "hero.trusted": "Confiado por familias inmigrantes en Massachusetts",

    // Features
    "features.title": "Todo lo que Necesitas para Prepararte",
    "features.subtitle": "Un reporte de crédito. Preparación hipotecaria completa con IA.",

    // How it works
    "how.title": "Cómo Funciona",
    "how.step1.title": "Sube Tu Reporte de Crédito",
    "how.step1.desc": "Sube tu PDF. Soportamos los 3 burós de crédito.",
    "how.step2.title": "La IA Analiza Todo",
    "how.step2.desc": "Nuestra IA lee cada línea y explica todo en lenguaje simple.",
    "how.step3.title": "Recibe Tu Plan",
    "how.step3.desc": "Cartas de disputa, plan de 90 días y tu puntaje de preparación.",

    // Auth
    "auth.signin.title": "Bienvenido de vuelta",
    "auth.signin.subtitle": "Inicia sesión en tu cuenta Morabeza",
    "auth.signup.title": "Prepárate para la hipoteca",
    "auth.signup.subtitle": "Crea tu cuenta gratuita de Morabeza",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.fullname": "Nombre Completo",
    "auth.signin.button": "Iniciar Sesión",
    "auth.signup.button": "Crear Cuenta",
    "auth.google": "Continuar con Google",
    "auth.no_account": "¿No tienes cuenta?",
    "auth.have_account": "¿Ya tienes cuenta?",
    "auth.check_email": "Revisa tu correo para confirmar tu cuenta.",

    // Upload
    "upload.title": "Sube Tu Reporte de Crédito",
    "upload.subtitle": "Sube tu PDF y nuestra IA lo analizará al instante.",
    "upload.drag": "Arrastra y suelta tu PDF aquí",
    "upload.or": "o",
    "upload.browse": "Explorar archivos",
    "upload.analyzing": "Analizando tu reporte de crédito...",
    "upload.success": "¡Análisis completo!",

    // Dashboard
    "dashboard.title": "Tu Preparación Hipotecaria",
    "dashboard.score": "Puntaje de Preparación",
    "dashboard.credit": "Resumen de Crédito",
    "dashboard.disputes": "Cartas de Disputa",
    "dashboard.plan": "Plan de Acción",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Algo salió mal. Intenta de nuevo.",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.next": "Siguiente",
    "common.back": "Atrás",
    "common.download": "Descargar",
    "common.copy": "Copiar",
    "common.copied": "¡Copiado!",
  },
  pt: {
    // Nav
    "nav.home": "Início",
    "nav.chat": "Chat",
    "nav.credit": "Crédito",
    "nav.dashboard": "Painel",
    "nav.documents": "Documentos",
    "nav.resources": "Recursos",
    "nav.signin": "Entrar",
    "nav.signup": "Começar",
    "nav.signout": "Sair",

    // Landing
    "hero.title": "Prepare Sua Família para o Financiamento",
    "hero.subtitle":
      "Envie seu relatório de crédito. Nossa IA analisa, escreve cartas de disputa e cria seu plano personalizado de 90 dias.",
    "hero.cta": "Começar Grátis",
    "hero.secondary": "Ver Como Funciona",
    "hero.trusted": "Confiado por famílias imigrantes em Massachusetts",

    // Features
    "features.title": "Tudo que Você Precisa para se Preparar",
    "features.subtitle": "Um relatório de crédito. Preparação hipotecária completa com IA.",

    // How it works
    "how.title": "Como Funciona",
    "how.step1.title": "Envie Seu Relatório de Crédito",
    "how.step1.desc": "Envie seu PDF. Suportamos os 3 bureaus de crédito.",
    "how.step2.title": "A IA Analisa Tudo",
    "how.step2.desc": "Nossa IA lê cada linha e explica tudo em linguagem simples.",
    "how.step3.title": "Receba Seu Plano",
    "how.step3.desc": "Cartas de disputa, plano de 90 dias e sua pontuação de prontidão.",

    // Auth
    "auth.signin.title": "Bem-vindo de volta",
    "auth.signin.subtitle": "Entre na sua conta Morabeza",
    "auth.signup.title": "Prepare-se para o financiamento",
    "auth.signup.subtitle": "Crie sua conta gratuita no Morabeza",
    "auth.email": "E-mail",
    "auth.password": "Senha",
    "auth.fullname": "Nome Completo",
    "auth.signin.button": "Entrar",
    "auth.signup.button": "Criar Conta",
    "auth.google": "Continuar com Google",
    "auth.no_account": "Não tem uma conta?",
    "auth.have_account": "Já tem uma conta?",
    "auth.check_email": "Verifique seu e-mail para confirmar sua conta.",

    // Upload
    "upload.title": "Envie Seu Relatório de Crédito",
    "upload.subtitle": "Envie seu PDF e nossa IA irá analisá-lo instantaneamente.",
    "upload.drag": "Arraste e solte seu PDF aqui",
    "upload.or": "ou",
    "upload.browse": "Procurar arquivos",
    "upload.analyzing": "Analisando seu relatório de crédito...",
    "upload.success": "Análise concluída!",

    // Dashboard
    "dashboard.title": "Sua Prontidão Hipotecária",
    "dashboard.score": "Pontuação de Prontidão",
    "dashboard.credit": "Resumo de Crédito",
    "dashboard.disputes": "Cartas de Disputa",
    "dashboard.plan": "Plano de Ação",

    // Common
    "common.loading": "Carregando...",
    "common.error": "Algo deu errado. Tente novamente.",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.next": "Próximo",
    "common.back": "Voltar",
    "common.download": "Baixar",
    "common.copy": "Copiar",
    "common.copied": "Copiado!",
  },
  kea: {
    // Nav
    "nav.home": "Inisiu",
    "nav.chat": "Papia",
    "nav.credit": "Kreditu",
    "nav.dashboard": "Painel",
    "nav.documents": "Dokumentu",
    "nav.resources": "Rekursu",
    "nav.signin": "Entra",
    "nav.signup": "Kumesa",
    "nav.signout": "Sai",

    // Landing
    "hero.title": "Prepara Bu Familia Pa Kompra Kaza",
    "hero.subtitle":
      "Manda bu reporte de kreditu. Nos IA ta analiza, ta skriva kartas de disputa, e ta kria bu planu di 90 dia.",
    "hero.cta": "Kumesa Gratis",
    "hero.secondary": "Odja Kuma Funxona",
    "hero.trusted": "Konfiadu pa familias imigrantes na Massachusetts",

    // Features
    "features.title": "Tudu ki Bu Meste Pa Sta Prontu",
    "features.subtitle": "Un reporte de kreditu. Preparason kompletu ku IA.",

    // How it works
    "how.title": "Kuma Ki Funxona",
    "how.step1.title": "Manda Bu Reporte de Kreditu",
    "how.step1.desc": "Manda bu PDF. Nu suporta tudu 3 bureaus.",
    "how.step2.title": "IA Ta Analiza Tudu",
    "how.step2.desc": "Nos IA ta le kada linha e ta splika tudu na lingua simples.",
    "how.step3.title": "Resebe Bu Planu",
    "how.step3.desc": "Kartas de disputa, planu di 90 dia, e bu skoru de prontidão.",

    // Auth
    "auth.signin.title": "Bem-vindadu di volta",
    "auth.signin.subtitle": "Entra na bu konta Morabeza",
    "auth.signup.title": "Prepara-t pa kompra kaza",
    "auth.signup.subtitle": "Kria bu konta gratis na Morabeza",
    "auth.email": "Email",
    "auth.password": "Palavra-passe",
    "auth.fullname": "Nomi Kompletu",
    "auth.signin.button": "Entra",
    "auth.signup.button": "Kria Konta",
    "auth.google": "Kontinua ku Google",
    "auth.no_account": "Ka tem konta inda?",
    "auth.have_account": "Dja tem konta?",
    "auth.check_email": "Odja bu email pa konfirma bu konta.",

    // Upload
    "upload.title": "Manda Bu Reporte de Kreditu",
    "upload.subtitle": "Manda bu PDF e nos IA ta analiza djuntu.",
    "upload.drag": "Arasta bu PDF pa li",
    "upload.or": "o",
    "upload.browse": "Txuba arku",
    "upload.analyzing": "Ta analiza bu reporte de kreditu...",
    "upload.success": "Analizi kompletu!",

    // Dashboard
    "dashboard.title": "Bu Prontidão pa Kompra Kaza",
    "dashboard.score": "Skoru de Prontidão",
    "dashboard.credit": "Resumo de Kreditu",
    "dashboard.disputes": "Kartas de Disputa",
    "dashboard.plan": "Planu di Ason",

    // Common
    "common.loading": "Ta karga...",
    "common.error": "Algum koiza korreru mau. Tenta di novu.",
    "common.save": "Guarda",
    "common.cancel": "Kansela",
    "common.next": "Proksimu",
    "common.back": "Volta",
    "common.download": "Baxka",
    "common.copy": "Kopia",
    "common.copied": "Kopiadu!",
  },
  fr: {
    // Nav
    "nav.home": "Accueil",
    "nav.chat": "Chat",
    "nav.credit": "Crédit",
    "nav.dashboard": "Tableau de bord",
    "nav.documents": "Documents",
    "nav.resources": "Ressources",
    "nav.signin": "Se connecter",
    "nav.signup": "Commencer",
    "nav.signout": "Se déconnecter",

    // Landing
    "hero.title": "Préparez Votre Famille pour le Prêt Immobilier",
    "hero.subtitle":
      "Téléchargez votre rapport de crédit. Notre IA l'analyse, rédige des lettres de contestation et crée votre plan personnalisé de 90 jours.",
    "hero.cta": "Commencer Gratuitement",
    "hero.secondary": "Voir Comment Ça Marche",
    "hero.trusted": "Approuvé par les familles immigrantes du Massachusetts",

    // Features
    "features.title": "Tout ce Dont Vous Avez Besoin",
    "features.subtitle": "Un rapport de crédit. Préparation complète par IA.",

    // How it works
    "how.title": "Comment Ça Marche",
    "how.step1.title": "Téléchargez Votre Rapport de Crédit",
    "how.step1.desc": "Téléchargez votre PDF. Nous supportons les 3 bureaux de crédit.",
    "how.step2.title": "L'IA Analyse Tout",
    "how.step2.desc": "Notre IA lit chaque ligne et explique tout en langage simple.",
    "how.step3.title": "Recevez Votre Plan",
    "how.step3.desc": "Lettres de contestation, plan de 90 jours et votre score de préparation.",

    // Auth
    "auth.signin.title": "Bon retour",
    "auth.signin.subtitle": "Connectez-vous à votre compte Morabeza",
    "auth.signup.title": "Préparez-vous pour le prêt immobilier",
    "auth.signup.subtitle": "Créez votre compte Morabeza gratuit",
    "auth.email": "E-mail",
    "auth.password": "Mot de passe",
    "auth.fullname": "Nom Complet",
    "auth.signin.button": "Se connecter",
    "auth.signup.button": "Créer un compte",
    "auth.google": "Continuer avec Google",
    "auth.no_account": "Pas encore de compte ?",
    "auth.have_account": "Vous avez déjà un compte ?",
    "auth.check_email": "Vérifiez votre e-mail pour confirmer votre compte.",

    // Upload
    "upload.title": "Téléchargez Votre Rapport de Crédit",
    "upload.subtitle": "Téléchargez votre PDF et notre IA l'analysera instantanément.",
    "upload.drag": "Glissez-déposez votre PDF ici",
    "upload.or": "ou",
    "upload.browse": "Parcourir les fichiers",
    "upload.analyzing": "Analyse de votre rapport de crédit...",
    "upload.success": "Analyse terminée !",

    // Dashboard
    "dashboard.title": "Votre Préparation Hypothécaire",
    "dashboard.score": "Score de Préparation",
    "dashboard.credit": "Résumé de Crédit",
    "dashboard.disputes": "Lettres de Contestation",
    "dashboard.plan": "Plan d'Action",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Une erreur s'est produite. Veuillez réessayer.",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.next": "Suivant",
    "common.back": "Retour",
    "common.download": "Télécharger",
    "common.copy": "Copier",
    "common.copied": "Copié !",
  },
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("morabeza-locale");
    if (saved && ["en", "es", "pt", "kea", "fr"].includes(saved)) return saved as Locale;
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    if (browserLang === "es") return "es";
    if (browserLang === "pt") return "pt";
    if (browserLang === "fr") return "fr";
    return "en";
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("morabeza-locale", newLocale);
  };

  const t = (key: string): string => {
    return translations[locale][key] ?? translations.en[key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}
