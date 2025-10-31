
import React from "react";

interface TableRowSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({
  rows = 6,
  columns = 6,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="p-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableRowSkeleton;
