import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { AvatarImageUpload } from "./AvatarImageUpload";

export function PersonalTab({ register, formState, watch, setValue }) {
  return (
    <div className="space-y-5 animate-fadeUp">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-bold text-white tracking-tight">Personal Details</h3>
        <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure your profile header biography</p>
      </div>

      <div className="grid gap-4.5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Professional Title / Name"
            placeholder="E.g., Sarah Connor"
            {...register("title")}
            error={formState.errors.title?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Professional Headline / Value Proposition"
            placeholder="E.g., Senior Cloud Architect & DevOps Consultant"
            {...register("tagline")}
            error={formState.errors.tagline?.message}
            hint="A concise one-line headline summarizing your professional expertise."
          />
        </div>
        <div className="sm:col-span-2">
          {watch && setValue ? (
            <AvatarImageUpload
              value={watch("avatarUrl")}
              onChange={(val) => setValue("avatarUrl", val, { shouldDirty: true })}
            />
          ) : (
            <Input
              label="Avatar Image URL"
              placeholder="https://cloudinary.com/avatar.jpg"
              {...register("avatarUrl")}
              error={formState.errors.avatarUrl?.message}
            />
          )}
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Profile Cover Image URL"
            placeholder="https://cloudinary.com/cover.jpg"
            {...register("coverImageUrl")}
            error={formState.errors.coverImageUrl?.message}
            hint="Displays as a horizontal banner background behind your profile avatar."
          />
        </div>
      </div>

      <Textarea
        label="Professional Biography"
        placeholder="Briefly tell your profile visitors about your background, goals, and focus areas..."
        {...register("bio")}
        error={formState.errors.bio?.message}
        hint="Write a brief overview. Highlight accomplishments and core credentials."
      />

      <div className="grid gap-4.5 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <Input
            label="Languages"
            placeholder="E.g., English, Spanish"
            {...register("languagesRaw")}
            error={formState.errors.languagesRaw?.message}
            hint="Comma separated values"
          />
        </div>
        <div className="sm:col-span-1">
          <Input
            label="Core Skills"
            placeholder="E.g., MERN stack, SEO"
            {...register("skillsRaw")}
            error={formState.errors.skillsRaw?.message}
            hint="Comma separated values"
          />
        </div>
        <div className="sm:col-span-1">
          <Input
            label="Certifications"
            placeholder="E.g., AWS Architect"
            {...register("certificationsRaw")}
            error={formState.errors.certificationsRaw?.message}
            hint="Comma separated values"
          />
        </div>
      </div>
    </div>
  );
}
