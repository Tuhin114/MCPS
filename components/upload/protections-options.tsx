"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface ProtectionOptionsProps {
  onOptionsChange: (options: ProtectionSettings) => void;
}

export interface ProtectionSettings {
  encryptFile: boolean;
  addWatermark: boolean;
  watermarkText: string;
}

export default function ProtectionOptions({
  onOptionsChange,
}: ProtectionOptionsProps) {
  const [settings, setSettings] = useState<ProtectionSettings>({
    encryptFile: true,
    addWatermark: true,
    watermarkText: "© My Content - All Rights Reserved",
  });

  const handleEncryptChange = (checked: boolean) => {
    const newSettings = { ...settings, encryptFile: checked };
    setSettings(newSettings);
    onOptionsChange(newSettings);
  };

  const handleWatermarkChange = (checked: boolean) => {
    const newSettings = { ...settings, addWatermark: checked };
    setSettings(newSettings);
    onOptionsChange(newSettings);
  };

  const handleTextChange = (text: string) => {
    const newSettings = { ...settings, watermarkText: text };
    setSettings(newSettings);
    onOptionsChange(newSettings);
  };

  return (
    <Card className="border-border bg-card p-5">
      <h2 className="mb-5 text-lg font-semibold text-foreground">
        Protection Options
      </h2>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Encrypt */}
        <div className="rounded-xl border border-primary/20 bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label className="text-base font-medium text-foreground">
                Encrypt File
              </Label>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Encrypt your file with AES-256 before storing.
              </p>
            </div>

            <Switch
              checked={settings.encryptFile}
              onCheckedChange={handleEncryptChange}
            />
          </div>
        </div>

        {/* Watermark */}
        <div className="rounded-xl border border-primary/20 bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label className="text-base font-medium text-foreground">
                Add Watermark
              </Label>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Add text watermark to images and videos.
              </p>
            </div>

            <Switch
              checked={settings.addWatermark}
              onCheckedChange={handleWatermarkChange}
            />
          </div>
        </div>

        {/* Watermark Text + Preview */}
        <div className="rounded-xl border border-primary/20 bg-surface p-5">
          <h3 className="mb-4 text-base font-medium text-foreground">
            Watermark Text
          </h3>

          <div className="flex gap-4">
            {/* Input */}
            <div className="flex-1">
              <Input
                value={settings.watermarkText}
                onChange={(e) => handleTextChange(e.target.value)}
                disabled={!settings.addWatermark}
                className="
                border-primary/20
                bg-background
                text-foreground
                placeholder:text-muted-foreground
                focus-visible:ring-primary
              "
              />

              <p className="mt-4 text-sm text-muted-foreground">Preview</p>
            </div>

            {/* Preview Thumbnail */}
            <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-primary/20">
              <Image
                width={400}
                height={300}
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                alt="Preview"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-x-2 bottom-2">
                <div className="rounded bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm truncate">
                  {settings.watermarkText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
