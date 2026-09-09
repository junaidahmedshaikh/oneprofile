import React, { useState } from "react";
import { ArrowLeft, ArrowRight, UserCheck, Star } from "lucide-react";

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      bg: "bg-[#88D9BE]", // Soft mint turquoise
      badge: "B2B Sales Leader",
      name: "Marcus Vance",
      role: "VP of Enterprise Partnerships",
      quote: "At our annual summit, while others fumbled with paper cards, I tapped my OneProfile card on 140+ prospect phones. 68 saved my vCard on the spot, and 24 submitted inquiries. We closed ₹85 Lakhs in pipeline directly from those taps.",
      tag: "+42% Lead Conversion Rate",
    },
    {
      bg: "bg-[#FF9E80]", // Soft melon coral
      badge: "Consultant & Coach",
      name: "Priya Sundaram",
      role: "Fractional CMO & Strategy Advisor",
      quote: "I canceled my Linktree, my Calendly, and paused my expensive website hosting. OneProfile gives me a portfolio, calendar booking, and contact saving in one lightning-fast link. My clients constantly comment on how modern it looks.",
      tag: "Replaced 3 Paid Subscriptions",
    },
    {
      bg: "bg-[#C4B5FD]", // Soft lilac
      badge: "Commercial Real Estate",
      name: "Daniel Chen",
      role: "Principal Broker, Metro Realty Group",
      quote: "Real estate is all about speed and immediate first impressions. When buyers scan my OneProfile QR, they get active listings, direct WhatsApp, and my contact card in seconds. We rolled it out to all 35 agents in our brokerage.",
      tag: "35 Agents Onboarded",
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="bg-white py-20 sm:py-28 border-b border-[#EAECEF] overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Heading & Circular Navigation Buttons */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163300]/5 text-xs font-bold text-[#163300]">
              <Star className="w-3.5 h-3.5 text-[#255203] fill-[#255203]" />
              <span>Customer Success Stories</span>
            </div>

            <h2 className="font-parafina font-black text-[42px] sm:text-[64px] lg:text-[76px] text-[#163300] tracking-[-0.04em] uppercase leading-[0.92]">
              FOR PEOPLE
              <br />
              GOING
              <br />
              PLACES
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-sm">
              From solo consultants to fast-growing sales organizations, see how high-performers use OneProfile to network smarter.
            </p>

            {/* Circular Arrow Navigation Buttons */}
            <div className="flex items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-[#163300] hover:border-black hover:bg-[#F2F4F7] transition-colors active:scale-95 shadow-xs"
                aria-label="Previous story"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-[#163300] hover:border-black hover:bg-[#F2F4F7] transition-colors active:scale-95 shadow-xs"
                aria-label="Next story"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column: Carousel of Tall Pastel Cards */}
          <div className="lg:col-span-8 overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 60}%)` }}
            >
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className={`w-[320px] sm:w-[380px] shrink-0 ${t.bg} rounded-[38px] p-8 sm:p-10 flex flex-col justify-between min-h-[480px] sm:min-h-[520px] shadow-sm select-none`}
                >
                  {/* Card Top: Persona Badge & Details */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-3.5 py-1 rounded-full bg-white/70 text-[#163300] font-black text-[11px] uppercase tracking-wider">
                        {t.badge}
                      </span>
                      <div className="flex text-amber-500 text-xs">
                        {"★".repeat(5)}
                      </div>
                    </div>

                    {/* Testimonial Quote */}
                    <p className="font-parafina font-extrabold text-xl sm:text-[23px] text-[#163300] leading-snug tracking-[-0.02em]">
                      “{t.quote}”
                    </p>
                  </div>

                  {/* Card Bottom: Author Info and Pill Tag */}
                  <div className="pt-6 space-y-4">
                    <div>
                      <div className="font-black text-base text-[#163300]">{t.name}</div>
                      <div className="text-xs text-[#163300]/80 font-medium">{t.role}</div>
                    </div>

                    <div>
                      <span className="inline-block px-4 py-2 rounded-full bg-[#163300] text-white text-[11px] font-extrabold shadow-sm">
                        {t.tag}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
