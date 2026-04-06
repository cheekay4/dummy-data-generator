"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
  className?: string;
  description?: string;
}

function formatNumber(num: number): string {
  if (num === 0) return "";
  return num.toLocaleString("ja-JP");
}

function parseNumber(str: string): number {
  const cleaned = str.replace(/[,、]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  suffix,
  placeholder,
  min,
  max,
  required,
  className,
  description,
}: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [rawValue, setRawValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (num: number): string | null => {
      if (required && num === 0) return "この項目は必須です";
      if (min !== undefined && num < min) return `${min.toLocaleString()}以上で入力してください`;
      if (max !== undefined && num > max) return `${max.toLocaleString()}以下で入力してください`;
      return null;
    },
    [required, min, max]
  );

  const handleFocus = () => {
    setIsFocused(true);
    setRawValue(value === 0 ? "" : String(value));
  };

  const handleBlur = () => {
    setIsFocused(false);
    const num = parseNumber(rawValue);
    const validationError = validate(num);
    setError(validationError);
    onChange(num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^[\d,、]+$/.test(val)) {
      setRawValue(val);
      const num = parseNumber(val);
      setError(null);
      onChange(num);
    }
  };

  const displayValue = isFocused ? rawValue : formatNumber(value);

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            suffix && "pr-10",
            error && "border-destructive"
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
