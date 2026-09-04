import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  RotateCw,
  MessageCircle,
  HelpCircle,
  Lightbulb,
  ThumbsUp,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { sounds } from '../utils/audio';

// Types for Disqus SPA integration
declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: {
          page: {
            url?: string;
            identifier?: string;
            title?: string;
          };
        }) => void;
      }) => void;
    };
    DISQUSWIDGETS?: {
      getCount: (options?: { reset?: boolean }) => void;
    };
    disqus_config?: (this: {
      page: {
        url?: string;
        identifier?: string;
        title?: string;
      };
    }) => void;
  }
}

export const TalkToUsView: React.FC = () => {
  const [isReloading, setIsReloading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Real fixed canonical identifier and URL configuration
  const PAGE_IDENTIFIER = 'nutricoach-talk-to-us';
  const getPageUrl = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return `${window.location.origin}/talk-to-us`;
    }
    return 'https://nutricoach.app/talk-to-us';
  };

  const loadOrReloadDisqus = () => {
    const pageUrl = getPageUrl();

    // Configure global disqus_config object
    window.disqus_config = function () {
      this.page.url = pageUrl;
      this.page.identifier = PAGE_IDENTIFIER;
      this.page.title = 'Talk to Us - NutriCoach Community & Feedback';
    };

    if (window.DISQUS) {
      // In a SPA, if Disqus script is already loaded, reset the thread with updated config
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = pageUrl;
            this.page.identifier = PAGE_IDENTIFIER;
            this.page.title = 'Talk to Us - NutriCoach Community & Feedback';
          },
        });
      } catch (err) {
        console.error('Failed to reset Disqus thread:', err);
      }
    } else {
      // First load: dynamically insert embed.js if not already present in DOM
      const existingScript = document.querySelector('script[src*="nutricoach2.disqus.com/embed.js"]');
      if (!existingScript) {
        const d = document;
        const s = d.createElement('script');
        s.src = 'https://nutricoach2.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.onerror = () => {
          console.warn('Disqus embed script could not be loaded in this environment.');
        };
        (d.head || d.body).appendChild(s);
      }
    }

    // Embed count script if not present
    const existingCountScript = document.getElementById('dsq-count-scr');
    if (!existingCountScript) {
      const countScript = document.createElement('script');
      countScript.id = 'dsq-count-scr';
      countScript.src = 'https://nutricoach2.disqus.com/count.js';
      countScript.async = true;
      countScript.onerror = () => {
        console.warn('Disqus count script could not be loaded in this environment.');
      };
      (document.head || document.body).appendChild(countScript);
    } else if (typeof window.DISQUSWIDGETS !== 'undefined') {
      try {
        window.DISQUSWIDGETS.getCount({ reset: true });
      } catch {
        // ignore if count widget is still initializing
      }
    }
  };

  useEffect(() => {
    // Whenever this tab mounts in the SPA, initialize or reload Disqus
    loadOrReloadDisqus();
  }, []);

  const handleManualReload = () => {
    sounds.playClick();
    setIsReloading(true);
    loadOrReloadDisqus();
    setTimeout(() => setIsReloading(false), 800);
  };

  const topicIdeas = [
    { label: 'Feature Request', icon: Lightbulb, prompt: 'I would love to see a feature for...' },
    { label: 'Nutrition Question', icon: HelpCircle, prompt: 'Quick question about my protein targets...' },
    { label: 'Feedback / Kudos', icon: ThumbsUp, prompt: 'My thoughts on the AI meal scanner...' },
  ];

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto px-4 pt-2 animate-fadeIn">
      {/* Header section */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
            COMMUNITY &amp; SUPPORT
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Talk to Us
          </h1>
        </div>

        <button
          id="reload-disqus-btn"
          onClick={handleManualReload}
          className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition-colors shadow-2xs flex items-center gap-1.5"
          title="Reload discussion thread"
        >
          <RotateCw className={`w-3.5 h-3.5 text-emerald-700 ${isReloading ? 'animate-spin' : ''}`} />
          <span>Reload Thread</span>
        </button>
      </div>

      {/* Intro explanation card */}
      <div className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare className="w-4.5 h-4.5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">
              Community &amp; Coaching Feedback
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We read every thought! Share your feedback, meal tracking experiences, app suggestions, or ask our community and certified coaching team anything.
            </p>
          </div>
        </div>

        {/* Quick topic suggestion chips */}
        <div className="pt-1 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 block mb-2">
            Suggested conversation topics:
          </span>
          <div className="flex flex-wrap gap-2">
            {topicIdeas.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopic === topic.label;
              return (
                <button
                  key={topic.label}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTopic(isSelected ? null : topic.label);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>
          {selectedTopic && (
            <p className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 rounded-xl px-2.5 py-1.5 border border-emerald-200/60 flex items-center gap-1.5 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
              <span>
                Tip: Start your comment with: &ldquo;{topicIdeas.find((t) => t.label === selectedTopic)?.prompt}&rdquo;
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Disqus Discussion Thread Container */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            <span>Discussion Thread</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Powered by Disqus</span>
          </div>
        </div>

        {/* Disqus Root Element */}
        <div id="disqus_thread" className="min-h-[360px] pt-1"></div>

        {/* Noscript fallback according to Disqus universal code */}
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-emerald-700 underline font-medium">
            comments powered by Disqus.
          </a>
        </noscript>

        {/* Footnote with link to channel */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Forum: nutricoach2</span>
          <a
            href="https://disqus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>Disqus</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
