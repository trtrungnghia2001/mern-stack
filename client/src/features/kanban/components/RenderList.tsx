import type { ReactNode } from "react";

interface RenderListProps<T> {
  title?: string;
  icon?: ReactNode;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function RenderList<T>({
  title,
  icon,
  items,
  renderItem,
}: RenderListProps<T>) {
  return (
    <div className="space-y-4">
      {(title || icon) && (
        <div className="flex items-center gap-2 ">
          {icon && <span className="text-primary">{icon}</span>}
          {title && <span className="text-lg font-semibold">{title}</span>}
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center text-gray-500">No items to display</div>
      )}

      {items.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <li key={idx}>{renderItem(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
