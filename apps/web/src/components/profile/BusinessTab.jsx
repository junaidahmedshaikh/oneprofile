import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export function BusinessTab({ register, formState }) {
  return (
    <div className="space-y-5 animate-fadeUp">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-bold text-white tracking-tight">Business Details</h3>
        <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure your organization and company card parameters</p>
      </div>

      <div className="grid gap-4.5 sm:grid-cols-2">
        <Input
          label="Company / Brand Name"
          placeholder="E.g., Connor Security Consultants"
          {...register("companyName")}
          error={formState.errors.companyName?.message}
        />
        <Input
          label="Company Logo Image URL"
          placeholder="https://cloudinary.com/logo.jpg"
          {...register("logoUrl")}
          error={formState.errors.logoUrl?.message}
        />
      </div>

      <Input
        label="Company Tagline"
        placeholder="E.g., Securing the future of cloud computing pipelines"
        {...register("tagline")}
        error={formState.errors.tagline?.message}
        hint="A concise one-line tagline showing your business specialty."
      />

      <Textarea
        label="Business Description Summary"
        placeholder="Provide a comprehensive summary detailing your business packages, focus areas, and values..."
        {...register("description")}
        error={formState.errors.description?.message}
        hint="Detail your business operations clearly. Keep it legible."
      />

      <hr className="border-white/[0.05]" />

      <div className="space-y-4">
        <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Advanced Organization Credentials</span>
        <div className="grid gap-4.5 sm:grid-cols-2">
          <Input
            label="GST Identification Number (GSTIN) - Optional"
            placeholder="E.g., 22AAAAA0000A1Z5"
            {...register("gstNumber")}
            error={formState.errors.gstNumber?.message}
          />
          <Input
            label="Business Registration Details - Optional"
            placeholder="E.g., CIN or Trade License Number"
            {...register("registrationDetails")}
            error={formState.errors.registrationDetails?.message}
          />
          <div className="sm:col-span-2">
            <Input
              label="Service Area / Geographical Coverage"
              placeholder="E.g., North America, EMEA Region, or Local (San Francisco)"
              {...register("serviceArea")}
              error={formState.errors.serviceArea?.message}
            />
          </div>
          <Input
            label="Founded Year"
            type="number"
            placeholder="E.g., 2018"
            {...register("foundedYear", { valueAsNumber: true })}
            error={formState.errors.foundedYear?.message}
          />
          <Input
            label="Team Size (Employees count)"
            type="number"
            placeholder="E.g., 25"
            {...register("teamSize", { valueAsNumber: true })}
            error={formState.errors.teamSize?.message}
          />
        </div>
      </div>
    </div>
  );
}
