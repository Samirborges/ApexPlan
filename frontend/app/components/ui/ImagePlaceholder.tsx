import { clsx } from "clsx";

interface ImagePlaceholderProps {
  className?: string;
  label?: string;
}

export function ImagePlaceholder({ className, label }: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label ?? "Imagem em breve"}
      className={clsx(
        "flex items-center justify-center rounded-2xl bg-gray-200 text-gray-400 text-sm select-none",
        className
      )}
    >
      {label ?? "Imagem"}
    </div>
  );
}