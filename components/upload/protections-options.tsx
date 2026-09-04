"use client";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import { ShieldCheck, Droplets, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProtectionOptionsProps {
  settings: ProtectionSettings;
  onOptionsChange: (options: ProtectionSettings) => void;
}

export interface ProtectionSettings {
  encryptFile: boolean;
  addWatermark: boolean;
  watermarkText: string;
}

interface OptionRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function OptionRow({
  icon,
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: OptionRowProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors duration-150",
        checked && !disabled
          ? "border-amber-500/30 bg-amber-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]"
          : "border-white/5 bg-black/40 backdrop-blur-xl",
        disabled && "opacity-50",
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
            checked && !disabled
              ? "border-amber-500/30 bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-500"
              : "border-white/5 bg-white/5 text-muted-foreground",
          )}
        >
          {icon}
        </div>
        <div>
          <Label className="text-[13.5px] font-medium text-foreground cursor-pointer">
            {title}
          </Label>
          <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className="mt-0.5 shrink-0"
      />
    </div>
  );
}

export default function ProtectionOptions({
  settings,
  onOptionsChange,
}: ProtectionOptionsProps) {
  const handleEncryptChange = (checked: boolean) => {
    if (!checked) {
      toast.error(
        "Switching off encryption will make the media publicly accessible to anyone with a shareable link.",
      );
    }
    onOptionsChange({
      ...settings,
      encryptFile: checked,
      addWatermark: checked,
    });
  };

  const handleWatermarkChange = (checked: boolean) => {
    if (!settings.encryptFile) return;
    onOptionsChange({ ...settings, addWatermark: checked });
  };

  const handleTextChange = (text: string) => {
    onOptionsChange({ ...settings, watermarkText: text });
  };

  return (
    <div className="rounded-xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/5 px-5 py-4">
        <ShieldCheck className="h-4 w-4 text-amber-500" />
        <h2 className="text-[13.5px] font-semibold text-foreground">
          Protection settings
        </h2>
      </div>

      <div className="p-5 space-y-3">
        {/* Toggles row */}
        <div className="grid gap-3 sm:grid-cols-2">
          <OptionRow
            icon={<ShieldCheck className="h-4 w-4" />}
            title="AES-256 encryption"
            description="Encrypt your file before storing. Required for watermarking."
            checked={settings.encryptFile}
            onCheckedChange={handleEncryptChange}
          />
          <OptionRow
            icon={<Droplets className="h-4 w-4" />}
            title="Watermark"
            description="Embed a repeating text mark on images and videos."
            checked={settings.addWatermark}
            disabled={!settings.encryptFile}
            onCheckedChange={handleWatermarkChange}
          />
        </div>

        {/* Watermark text + preview */}
        <div
          className={cn(
            "rounded-xl border p-4 transition-colors duration-150",
            settings.addWatermark
              ? "border-amber-500/30 bg-amber-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]"
              : "border-white/5 bg-black/40 backdrop-blur-xl opacity-60",
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <Type className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[12.5px] font-medium text-foreground">
              Watermark text
            </span>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Input
                value={settings.watermarkText}
                onChange={(e) => handleTextChange(e.target.value)}
                disabled={!settings.encryptFile || !settings.addWatermark}
                placeholder="© Your Name"
                className="h-9 border-white/5 bg-background text-[13px] text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-amber-500/50 disabled:opacity-40"
              />
              <p className="text-[11.5px] text-muted-foreground">
                This text will repeat diagonally across protected media.
              </p>
            </div>

            {/* Preview */}
            <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-white/5">
              <Image
                width={400}
                height={300}
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                alt="Watermark preview"
                className="h-full w-full object-cover"
              />
              {settings.addWatermark && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute text-white/20 text-[9px] font-semibold whitespace-nowrap"
                      style={{
                        left: `${(i % 4) * 28 - 10}%`,
                        top: `${Math.floor(i / 4) * 22 - 5}%`,
                        transform: "rotate(-30deg)",
                      }}
                    >
                      {settings.watermarkText || "© Watermark"}
                    </span>
                  ))}
                </div>
              )}
              <div className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 bg-black/50 text-[9px] text-white/70 backdrop-blur-sm">
                preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

