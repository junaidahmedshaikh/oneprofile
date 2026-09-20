import React from "react";
import { Link } from "react-router-dom";
import { Wifi, Sparkles, RefreshCw, Smartphone, QrCode, Building2, ShieldCheck, Truck } from "lucide-react";

export function SmartNfcSection({ activeSegment = "personal" }) {
  const isBusiness = activeSegment === "business";

  return (
    <section
      id="smart-nfc"
      className="bg-[#FAFAF7] py-20 sm:py-28 border-b border-black/[0.07]"
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        {/* Text and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.06] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#576159] select-none">
              {isBusiness ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-[#163300]" />
                  <span>Enterprise Co-Branded NFC Hardware</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#163300]" />
                  <span>Physical Meets Digital</span>
                </>
              )}
            </div>

            <div className="space-y-2">
              <div className="font-editorial italic text-2xl sm:text-3xl text-[#576159]">
                Tactile permanence,
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#121814] tracking-[-0.035em] uppercase leading-[1.04]">
                {isBusiness ? (
                  <>
                    CO-BRANDED CARDS
                    <br />
                    FOR YOUR ENTIRE
                    <br />
                    SALES FORCE.
                  </>
                ) : (
                  <>
                    ONE SMART CARD.
                    <br />
                    INFINITE TAPS.
                    <br />
                    ZERO PAPER WASTE.
                  </>
                )}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#576159] font-normal leading-relaxed max-w-xl">
              {isBusiness ? (
                <>
                  Elevate your corporate brand at every meeting, conference, and client presentation. Precision laser-etched NFC cards bearing your company insignia, synchronized with your central directory in real-time.
                </>
              ) : (
                <>
                  Step into meetings, conferences, and networking events with a precision-crafted contactless NFC card. Tap it against any modern iPhone or Android, and your OneProfile appears instantly — no recipient app needed.
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to={isBusiness ? "/signup?type=business" : "/signup"}
                className="px-7 py-3 rounded-full font-semibold text-sm text-[#FAFAF7] bg-[#163300] hover:bg-[#0E2100] shadow-xs transition-all active:scale-[0.98]"
              >
                {isBusiness ? "Order Team NFC Cards →" : "Claim Your Free Profile →"}
              </Link>
              <Link
                to="/pricing"
                className="px-7 py-3 rounded-full font-semibold text-sm text-[#121814] bg-white border border-black/[0.12] hover:border-black/[0.25] transition-all active:scale-[0.98] shadow-xs"
              >
                {isBusiness ? "View Enterprise Plans" : "Compare NFC Materials"}
              </Link>
            </div>
          </div>

          {/* Key NFC Card Pillars */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-3.5 pt-2">
            {isBusiness ? (
              <>
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-black/[0.08] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-display font-bold text-sm text-[#121814]">
                    <Building2 className="w-4 h-4 text-[#163300]" />
                    <span>Laser-Etched Corporate Logo</span>
                  </div>
                  <p className="text-xs text-[#576159] leading-relaxed">
                    Custom co-branded matte polycarbonate, brushed stainless steel, or eco bamboo with company logo and employee name.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-black/[0.08] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-display font-bold text-sm text-[#121814]">
                    <RefreshCw className="w-4 h-4 text-[#163300]" />
                    <span>Instant Directory Sync</span>
                  </div>
                  <p className="text-xs text-[#576159] leading-relaxed">
                    Role, title, or phone number change? Cards update dynamically in 5 seconds with zero card re-issuance or printing costs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F2F4F7] border border-black/5 space-y-1">
                  <div className="flex items-center gap-2 font-black text-sm text-[#163300]">
                    <Truck className="w-4 h-4 text-[#255203]" />
                    <span>Bulk Fulfillment & Remote Dispatch</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Shipped in volume to company headquarters or dispatched individually to remote employee home offices.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-[#F2F4F7] border border-black/5 space-y-1">
                  <div className="flex items-center gap-2 font-black text-sm text-[#163300]">
                    <RefreshCw className="w-4 h-4 text-[#255203]" />
                    <span>Instant Real-Time Updates</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Changed your phone number, title, or links? Update online in 5 seconds; your physical NFC card updates immediately with no reprint needed.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F2F4F7] border border-black/5 space-y-1">
                  <div className="flex items-center gap-2 font-black text-sm text-[#163300]">
                    <Smartphone className="w-4 h-4 text-[#255203]" />
                    <span>Zero Recipient Friction</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The person you meet doesn't need an app or an account. Your card opens natively in Safari, Chrome, and all smartphone browsers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F2F4F7] border border-black/5 space-y-1">
                  <div className="flex items-center gap-2 font-black text-sm text-[#163300]">
                    <QrCode className="w-4 h-4 text-[#255203]" />
                    <span>Dynamic QR Code Backup</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Laser-engraved dynamic QR code on the back guarantees 100% compatibility across older smartphones and tablets.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
