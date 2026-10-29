'use client';

import { useState, useMemo } from 'react';
import HelpHeader from './HelpHeader';
import EmergencySafetyNotice from './EmergencySafetyNotice';
import HelpCategories from './HelpCategories';
import HelpFaqAccordion from './HelpFaqAccordion';
import DirectChannels from './DirectChannels';
import SupportContactForm from './SupportContactForm';
import { HELP_CATEGORIES, FAQS } from './helpData';

export default function HelpPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Questions');

  // Compute total results matching the query
  const totalResultsCount = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return 0;

    const matchedFaqs = FAQS.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    ).length;

    const matchedCategories = HELP_CATEGORIES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.topics.some((t) => t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q))
    ).length;

    return matchedFaqs + matchedCategories;
  }, [searchQuery]);

  const handleSelectCategoryFromGrid = (category) => {
    // Map category title to FAQ filter
    setSelectedCategory(category.title);
    const faqElement = document.getElementById('faqs');
    if (faqElement) {
      faqElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* 1. Help & Support Header with Search */}
      <HelpHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalResultsCount={totalResultsCount}
        isSearching={!!searchQuery.trim()}
      />

      {/* 2. Emergency Safety Notice */}
      <EmergencySafetyNotice />

      {/* 3. Direct Support Channels & Hours */}
      <DirectChannels />

      {/* 4. Browse Help Categories */}
      <HelpCategories
        searchQuery={searchQuery}
        onSelectCategory={handleSelectCategoryFromGrid}
      />

      {/* 5. Frequently Asked Questions (Accordion) */}
      <HelpFaqAccordion
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 6. Contact Support Form */}
      <SupportContactForm />
    </div>
  );
}

