export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqGroup = {
  title: string;
  items: readonly FaqItem[];
};

export type ContentSection = {
  id?: string;
  title: string;
  body: readonly string[];
  example?: {
    label: string;
    markdown: string;
    note: string;
  };
};

export type ContentPage = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  directory?: readonly { label: string; href: string }[];
  sections: readonly ContentSection[];
  cta: {
    primary: { href: string; label: string };
    secondary: { href: string; label: string };
  };
};
