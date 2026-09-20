import { Button } from "../ui/Button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/Table";
import { Check } from "lucide-react";

export function BillingTab() {
  const plans = [
    {
      name: "Free Plan",
      price: "₹0",
      period: "forever",
      desc: "For personal digital identity and simple cards.",
      features: [
        "1 Published Card",
        "Standard Analytics",
        "Basic Templates",
        "OneProfile Logo branding",
      ],
      active: true,
    },
    {
      name: "Pro Professional",
      price: "₹749",
      period: "month",
      desc: "For freelancers, consultants, and practitioners.",
      features: [
        "Unlimited Cards",
        "Advanced Search SEO",
        "Custom domain URL mapping",
        "No branding logos",
        "AI Writer assistant",
      ],
      active: false,
    },
    {
      name: "Enterprise Brand",
      price: "₹2,499",
      period: "month",
      desc: "For company directories, agencies, and teams.",
      features: [
        "Central team directory",
        "Bulk QR code generations",
        "NFC bulk compatibility templates",
        "Priority 24/7 support",
        "Custom templates API",
      ],
      active: false,
    },
  ];

  const invoices = [
    { id: "INV-8890", date: "2026-07-01", amount: "₹0", status: "Paid" },
    { id: "INV-8742", date: "2026-06-01", amount: "₹0", status: "Paid" },
  ];

  return (
    <div className="space-y-8 select-none">
      <div className="space-y-1">
        <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
          Subscription Plans
        </h3>
        <p className="text-xs text-slate-500">
          Manage your subscription tier, billing frequency, and active perks
        </p>
      </div>

      {/* Subscription Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p, i) => (
          <div
            key={i}
            className={`rounded-3xl p-6 flex flex-col justify-between relative transition-all ${
              p.active
                ? "border-2 border-[#163300] bg-emerald-50/20 shadow-xs"
                : "border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
            }`}
          >
            {p.active && (
              <span className="absolute top-4 right-4 rounded-full bg-[#163300] px-2.5 py-0.5 text-[10px] font-bold text-[#9FE870] uppercase tracking-wider">
                Current Plan
              </span>
            )}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {p.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 font-parafina">
                  {p.price}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  /{p.period}
                </span>
              </div>
              <ul className="space-y-2.5 pt-3 border-t border-slate-100">
                {p.features.map((f, fi) => (
                  <li
                    key={fi}
                    className="text-xs text-slate-600 font-medium flex items-center gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#9FE870]/30 text-[#163300] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="button"
              variant={p.active ? "outline" : "primary"}
              disabled={p.active}
              className="mt-6 w-full text-xs font-bold"
            >
              {p.active ? "Current Active Plan" : `Upgrade to ${p.name.split(" ")[0]}`}
            </Button>
          </div>
        ))}
      </div>

      {/* Mock Billing Invoice history */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <h4 className="font-parafina text-base font-bold text-slate-900 tracking-tight">
            Invoice History
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Download previous transactional receipts and statements
          </p>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableCell header className="font-bold text-slate-700 text-xs py-3">Invoice ID</TableCell>
                <TableCell header className="font-bold text-slate-700 text-xs py-3">Date</TableCell>
                <TableCell header className="font-bold text-slate-700 text-xs py-3">Amount</TableCell>
                <TableCell header className="font-bold text-slate-700 text-xs py-3">Status</TableCell>
                <TableCell header className="font-bold text-slate-700 text-xs py-3 text-right">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <TableCell className="text-xs font-semibold text-slate-800">{inv.id}</TableCell>
                  <TableCell className="text-xs text-slate-500">{inv.date}</TableCell>
                  <TableCell className="text-xs font-bold text-slate-900">{inv.amount}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {inv.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      className="text-xs font-bold text-[#163300] hover:underline"
                      onClick={() =>
                        alert(`Downloading invoice receipt ${inv.id}`)
                      }
                    >
                      Download PDF
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
