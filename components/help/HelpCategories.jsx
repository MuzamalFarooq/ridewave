'use client';

import { useState } from 'react';
import {
  Car,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Award,
  Wrench,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { HELP_CATEGORIES } from './helpData';

const iconMap = {
  Car,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Award,
  Wrench,
};

export default function HelpCategories({ searchQuery, onSelectCategory, onSelectTopic }) {
  const [activeModalCategory, setActiveModalCategory] = useState(null);

  // Filter categories and topics if search query is provided
  const query = (searchQuery || '').trim().toLowerCase();

  const filteredCategories = HELP_CATEGORIES.map((category) => {
    if (!query) {
      return { ...category, matchedTopics: category.topics, isMatched: true };
    }

    const matchesCategory =
      category.title.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.badge.toLowerCase().includes(query);

    const matchedTopics = category.topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) || topic.content.toLowerCase().includes(query)
    );

    const isMatched = matchesCategory || matchedTopics.length > 0;

    return {
      ...category,
      matchedTopics: matchedTopics.length > 0 ? matchedTopics : category.topics,
      isMatched,
    };
  }).filter((cat) => cat.isMatched);

  return (
    <section aria-labelledby="browse-categories-heading" className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCE7DF]/60 dark:bg-[#173F35] text-[#173F35] dark:text-[#C6A76B] text-xs font-bold uppercase tracking-widest border border-[#E7E5DD] dark:border-[#23584B]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Base</span>
          </div>
          <h2 id="browse-categories-heading" className="font-outfit font-extrabold text-2xl sm:text-4xl text-[#171A17] dark:text-[#F8F6F0]">
            Browse Help Categories
          </h2>
          <p className="text-sm sm:text-base text-[#4E554B] dark:text-[#D0DBD3]">
            Select a topic to explore step-by-step guides, policies, and operational tips.
          </p>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[#E7E5DD] dark:border-[#23584B] bg-white/50 dark:bg-[#173F35]/40 max-w-md mx-auto">
            <p className="font-outfit font-bold text-lg text-[#171A17] dark:text-[#F8F6F0] mb-1">
              No matching help categories found
            </p>
            <p className="text-xs text-[#4E554B] dark:text-[#D0DBD3]">
              Try searching with broader keywords or browse the FAQ section below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCategories.map((cat) => {
              const Icon = iconMap[cat.iconName] || BookOpen;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-[#E7E5DD] dark:border-[#23584B] bg-white dark:bg-[#173F35] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Header: Icon & Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#DCE7DF]/60 dark:bg-[#102F28] text-[#173F35] dark:text-[#C6A76B] flex items-center justify-center shrink-0 border border-[#E7E5DD] dark:border-[#23584B] group-hover:bg-[#173F35] group-hover:text-[#C6A76B] transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F8F6F0] dark:bg-[#102F28] text-[#173F35] dark:text-[#C6A76B] border border-[#E7E5DD] dark:border-[#23584B]">
                        {cat.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-outfit font-bold text-xl text-[#171A17] dark:text-[#F8F6F0] group-hover:text-[#173F35] dark:group-hover:text-[#C6A76B] transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-[#4E554B] dark:text-[#D0DBD3] mt-1.5 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    {/* Topics List */}
                    <div className="space-y-2 pt-2 border-t border-[#E7E5DD]/70 dark:border-[#23584B]/70">
                      {cat.topics.slice(0, 4).map((topic, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (onSelectTopic) {
                              onSelectTopic(topic, cat);
                            } else {
                              setActiveModalCategory({ category: cat, selectedTopic: topic });
                            }
                          }}
                          className="w-full text-left py-1 px-2 rounded-lg text-xs text-[#2C322B] dark:text-[#F8F6F0] hover:bg-[#F8F6F0] dark:hover:bg-[#102F28] hover:text-[#173F35] dark:hover:text-[#C6A76B] transition-all flex items-center justify-between group/item cursor-pointer"
                        >
                          <span className="truncate pr-2 font-medium">{topic.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#4E554B] group-hover/item:text-[#C6A76B] group-hover/item:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-4 mt-4 border-t border-[#E7E5DD]/70 dark:border-[#23584B]/70">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectCategory) {
                          onSelectCategory(cat);
                        } else {
                          setActiveModalCategory({ category: cat, selectedTopic: cat.topics[0] });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F35] dark:text-[#C6A76B] hover:underline cursor-pointer"
                    >
                      <span>Explore all {cat.topics.length} guides</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for viewing all guides for a selected category */}
        {activeModalCategory && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveModalCategory(null)}
          >
            <div
              className="bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#E7E5DD] dark:border-[#23584B] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C6A76B]">
                    {activeModalCategory.category.badge}
                  </span>
                  <h3 className="font-outfit font-extrabold text-2xl text-[#171A17] dark:text-[#F8F6F0]">
                    {activeModalCategory.category.title} Guides
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalCategory(null)}
                  className="w-8 h-8 rounded-full bg-[#F8F6F0] dark:bg-[#102F28] text-[#171A17] dark:text-[#F8F6F0] flex items-center justify-center hover:bg-[#DCE7DF] transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {activeModalCategory.category.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E7E5DD] dark:border-[#23584B] bg-[#F8F6F0]/60 dark:bg-[#102F28]/60 space-y-1.5"
                  >
                    <h4 className="font-outfit font-bold text-base text-[#171A17] dark:text-[#F8F6F0]">
                      {topic.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4E554B] dark:text-[#D0DBD3] leading-relaxed">
                      {topic.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalCategory(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#173F35] dark:bg-[#C6A76B] text-white dark:text-[#102F28] font-bold text-xs"
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

