import { Button } from "../ui/Button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/Table";

export function BillingTab() {
  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      period: "forever",
      desc: "For personal digital identity cards.",
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
      price: "$9",
      period: "month",
      desc: "For freelancers and active practitioners.",
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
      price: "$29",
      period: "month",
      desc: "For company directories and teams.",
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
    { id: "INV-8890", date: "2026-07-01", amount: "$0.00", status: "Paid" },
    { id: "INV-8742", date: "2026-06-01", amount: "$0.00", status: "Paid" },
  ];

  return (
    <div className="space-y-8 select-none">
      <div>
        <h3 className="font-display text-lg font-bold text-slate-300 dark:text-white tracking-tight">
          Subscription Plans
        </h3>
        <p className="text-3xs text-oneprofile-600 font-bold uppercase tracking-wider mt-0.5">
          Manage plan and billing configurations
        </p>
      </div>

      {/* Subscription Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all ${
              p.active
                ? "bg-primary/5 border-primary/25 shadow-ds-card"
                : "bg-oneprofile-900/20 border-oneprofile-700 hover:bg-oneprofile-100"
            }`}
          >
            {p.active && (
              <span className="absolute top-3 right-3 rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 text-4xs font-bold text-primary uppercase tracking-wide">
                Current Plan
              </span>
            )}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-300 dark:text-white uppercase tracking-wider">
                  {p.name}
                </h4>
                <p className="text-3xs text-oneprofile-600 mt-1">{p.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-300 dark:text-white">
                  {p.price}
                </span>
                <span className="text-3xs text-oneprofile-600 font-semibold">
                  /{p.period}
                </span>
              </div>
              <ul className="space-y-2 pt-2 border-t border-oneprofile-700">
                {p.features.map((f, fi) => (
                  <li
                    key={fi}
                    className="text-3xs text-oneprofile-600 font-semibold flex items-center gap-1.5"
                  >
                    <span className="text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="button"
              variant={p.active ? "outline" : "primary"}
              disabled={p.active}
              className="mt-6 text-3xs font-extrabold w-full h-8.5 min-h-[34px] rounded-xl uppercase tracking-wider"
            >
              {p.active ? "Plan Active" : `Upgrade to ${p.name.split(" ")[0]}`}
            </Button>
          </div>
        ))}
      </div>

      {/* Mock Billing Invoice history */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-300 dark:text-white uppercase tracking-wider">
            Invoice History
          </h4>
          <p className="text-3xs text-oneprofile-600 font-semibold mt-0.5">
            Download previous transactional receipts
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Invoice ID</TableCell>
              <TableCell header>Date</TableCell>
              <TableCell header>Amount</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header className="text-right">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{inv.id}</TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>{inv.amount}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-4xs font-bold text-emerald-400">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    {inv.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className="text-3xs font-bold text-primary hover:underline"
                    onClick={() =>
                      alert(`Mock downloading invoice receipt ${inv.id}`)
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
  );
}
