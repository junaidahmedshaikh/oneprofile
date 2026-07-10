import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export function ExperienceTab({ watch, setValue }) {
  const experiences = watch("experience") || [];
  const [newExp, setNewExp] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: ""
  });

  const addExperience = () => {
    if (!newExp.title || !newExp.company) return;
    setValue("experience", [...experiences, newExp], { shouldDirty: true });
    setNewExp({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    });
  };

  const removeExperience = (index) => {
    const updated = experiences.filter((_, idx) => idx !== index);
    setValue("experience", updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-bold text-white tracking-tight">Professional Experience</h3>
        <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Add your career milestones and roles history</p>
      </div>

      {/* Add New Experience block */}
      <div className="p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-4">
        <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Add job role entry</span>
        <div className="grid gap-4.5 sm:grid-cols-2">
          <Input
            label="Job Title *"
            value={newExp.title}
            onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
            placeholder="E.g., Senior Software Architect"
          />
          <Input
            label="Company Name *"
            value={newExp.company}
            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
            placeholder="E.g., Stripe Inc."
          />
          <Input
            label="StartDate"
            value={newExp.startDate}
            onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
            placeholder="E.g., Jan 2024"
          />
          <Input
            label="EndDate"
            value={newExp.endDate}
            disabled={newExp.current}
            onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
            placeholder="E.g., Present"
          />
        </div>

        <label className="flex items-center gap-2 select-none cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={newExp.current}
            onChange={(e) => setNewExp({ ...newExp, current: e.target.checked, endDate: e.target.checked ? "Present" : "" })}
            className="rounded border-white/10 bg-white/5 text-brand-500 h-4 w-4"
          />
          <span className="text-xs text-slate-300">I currently work in this role</span>
        </label>

        <Textarea
          label="Job Description"
          value={newExp.description}
          onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
          placeholder="Outline your primary duties, projects managed, and technologies deployed..."
        />

        <Button 
          variant="secondary" 
          onClick={addExperience}
          disabled={!newExp.title || !newExp.company}
          className="text-xs w-full"
        >
          Add Role Entry
        </Button>
      </div>

      {/* Experience list */}
      <div className="space-y-3">
        {experiences.length ? (
          experiences.map((exp, index) => (
            <div 
              key={index}
              className="flex justify-between items-start gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] group hover:border-white/[0.08] transition-all"
            >
              <div>
                <h4 className="text-sm font-bold text-white leading-snug">{exp.title}</h4>
                <div className="text-2xs text-slate-400 font-semibold mt-0.5">
                  {exp.company} • <span className="text-slate-500">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                </div>
                {exp.description ? (
                  <p className="text-3xs text-slate-400 leading-relaxed mt-2 max-w-md">{exp.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No professional experience entries added yet.
          </div>
        )}
      </div>
    </div>
  );
}
