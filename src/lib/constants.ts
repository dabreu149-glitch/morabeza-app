export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", greeting: "Hello! How can I help you today?" },
  { code: "pt", name: "Português", greeting: "Olá! Como posso ajudá-lo hoje?" },
  { code: "es", name: "Español", greeting: "¡Hola! ¿Cómo puedo ayudarte hoy?" },
  {
    code: "kea",
    name: "Kriolu",
    greeting: "Oi! Kuma ki bu sta? N pode djudá-bu?",
  },
  { code: "zh", name: "中文", greeting: "你好！我今天能帮助您什么？" },
  { code: "vi", name: "Tiếng Việt", greeting: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  {
    code: "tl",
    name: "Filipino",
    greeting: "Kumusta! Paano kita matutulungan ngayon?",
  },
  {
    code: "ht",
    name: "Kreyòl Ayisyen",
    greeting: "Bonjou! Kijan mwen ka ede ou jodi a?",
  },
  { code: "ar", name: "العربية", greeting: "مرحبا! كيف يمكنني مساعدتك اليوم؟" },
  { code: "hi", name: "हिन्दी", greeting: "नमस्ते! मैं आज आपकी कैसे मदद कर सकता हूं?" },
];

export const TESTIMONIALS = [
  {
    name: "Maria S.",
    origin: "Cape Verde",
    quote:
      "Morabeza helped me understand my credit report for the first time. Now I have a real plan to buy my home.",
    score_before: 580,
    score_after: 642,
  },
  {
    name: "João F.",
    origin: "Brazil",
    quote:
      "The dispute letters worked! Two collections were removed from my credit report within 30 days.",
    score_before: 610,
    score_after: 668,
  },
  {
    name: "Ana L.",
    origin: "Dominican Republic",
    quote:
      "I didn't know I could get a mortgage with my ITIN. Morabeza showed me it was possible.",
    score_before: 595,
    score_after: 655,
  },
];

export const FEATURES = [
  {
    title: "AI Credit Analysis",
    description:
      "Upload your credit report once. Our AI reads every line, identifies all negative items, and explains what they mean in plain language.",
    icon: "FileSearch",
  },
  {
    title: "FCRA Dispute Letters",
    description:
      "Automatically generate legally-compliant dispute letters for every disputable item — one per bureau. Ready to mail.",
    icon: "Mail",
  },
  {
    title: "90-Day Action Plan",
    description:
      "A personalized, step-by-step mortgage readiness plan built around your specific situation and timeline.",
    icon: "Calendar",
  },
  {
    title: "Mortgage Readiness Score",
    description:
      "Track your readiness across credit, debt, savings, and documentation. Know exactly where you stand.",
    icon: "TrendingUp",
  },
  {
    title: "10+ Languages",
    description:
      "Chat in Kriolu, Portuguese, Spanish, English, and 6 more languages. Our AI understands your community.",
    icon: "Globe",
  },
  {
    title: "ITIN Mortgage Guidance",
    description:
      "Specialized knowledge about non-citizen mortgage options, ITIN loans, and lender requirements.",
    icon: "Home",
  },
];

export const DOCUMENT_CHECKLIST = [
  { id: "pay_stubs", label: "Last 2 pay stubs", category: "income" },
  { id: "tax_returns", label: "Last 2 years tax returns (W-2 or 1040)", category: "income" },
  { id: "bank_statements", label: "Last 3 months bank statements", category: "assets" },
  { id: "photo_id", label: "Government-issued photo ID", category: "identity" },
  { id: "itin_letter", label: "ITIN letter (if applicable)", category: "identity" },
  { id: "credit_report", label: "Credit report from all 3 bureaus", category: "credit" },
  { id: "employment_letter", label: "Employment verification letter", category: "income" },
  { id: "rent_history", label: "12 months rent payment history", category: "history" },
  { id: "utility_bills", label: "Recent utility bills", category: "identity" },
  { id: "gift_letters", label: "Gift letters (if using gift funds)", category: "assets" },
];

export const RESOURCES_CATEGORIES = [
  "Credit Basics",
  "Mortgage Process",
  "ITIN Mortgages",
  "Dispute Process",
  "Down Payment Assistance",
  "First-Time Buyer Programs",
];
