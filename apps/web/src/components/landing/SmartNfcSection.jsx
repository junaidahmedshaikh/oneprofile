import React from "react";
import { Link } from "react-router-dom";
import { Wifi, Sparkles, RefreshCw, Smartphone, QrCode, Building2, ShieldCheck, Truck } from "lucide-react";

export function SmartNfcSection({ activeSegment = "personal" }) {
  const isBusiness = activeSegment === "business";

  return (
    <section
      id="smart-nfc"
      className="bg-white py-16 sm:py-24 border-b border-[#EAECEF]"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        {/* Text and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163300]/5 text-xs font-bold text-[#163300]">
              {isBusiness ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-[#255203]" />
                  <span>Enterprise Co-Branded NFC Hardware</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#255203]" />
                  <span>Physical Meets Digital</span>
                </>
              )}
            </div>

            <h2 className="font-parafina font-black text-[38px] sm:text-[52px] lg:text-[58px] text-[#163300] tracking-[-0.035em] leading-[1.04]">
              {isBusiness ? (
                <>
                  Co-branded cards
                  <br />
                  for your entire
                  <br />
                  sales organization.
                </>
              ) : (
                <>
                  One smart card.
                  <br />
                  Infinite taps.
                  <br />
                  Zero paper waste.
                </>
              )}
            </h2>

            <p className="text-base sm:text-[18px] text-[#3A4833] font-normal leading-relaxed max-w-xl">
              {isBusiness ? (
                <>
                  Elevate your corporate brand at every meeting, conference, and expo. Precision laser-etched NFC cards bearing your company logo, linked directly to your central employee directory with zero paper waste.
                </>
              ) : (
                <>
                  Step into meetings, conferences, and expos with a precision-crafted contactless NFC card. Tap it against any modern iPhone or Android, and your OneProfile appears instantly — no app required for anyone.
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to={isBusiness ? "/signup?type=business" : "/signup"}
                className="px-8 py-3.5 rounded-full font-bold text-[15px] text-[#163300] bg-[#9FE870] hover:bg-[#8DE05B] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isBusiness ? "Order Team NFC Cards" : "Claim Your Free Profile"}
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-3.5 rounded-full font-bold text-[15px] text-[#163300] bg-white border border-[#163300] hover:bg-[#163300]/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isBusiness ? "View Enterprise Pricing" : "Order Custom Cards for Teams"}
              </Link>
            </div>
          </div>

          {/* Key NFC Card Pillars */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4 pt-2">
            {isBusiness ? (
              <>
                <div className="p-4 rounded-2xl bg-[#F2F4F7] border border-black/5 space-y-1">
                  <div className="flex items-center gap-2 font-black text-sm text-[#163300]">
                    <Building2 className="w-4 h-4 text-[#255203]" />
                    <span>Laser-Etched Corporate Logo</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Custom co-branded matte polycarbonate, brushed stainless steel, or eco bamboo with company logo and employee name.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F2F4F7] border border-black/5 space-y-1">
                  <div className="flex items-center gap-2 font-black text-sm text-[#163300]">
                    <RefreshCw className="w-4 h-4 text-[#255203]" />
                    <span>Instant Directory Sync</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
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
