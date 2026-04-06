import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  value: number;
  description?: string;
  variant?: "positive" | "negative" | "neutral";
}

const variantStyles = {
  positive: "border-green-500/50 bg-green-50 dark:bg-green-950/30",
  negative: "border-red-500/50 bg-red-50 dark:bg-red-950/30",
  neutral: "border-blue-500/50 bg-blue-50 dark:bg-blue-950/30",
};

const variantTextStyles = {
  positive: "text-green-700 dark:text-green-400",
  negative: "text-red-700 dark:text-red-400",
  neutral: "text-blue-700 dark:text-blue-400",
};

export function ResultCard({
  title,
  value,
  description,
  variant = "neutral",
}: ResultCardProps) {
  return (
    <Card className={cn("border-2", variantStyles[variant])}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("text-3xl font-bold", variantTextStyles[variant])}>
          {value.toLocaleString("ja-JP")}
          <span className="text-lg ml-1">円</span>
        </p>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
