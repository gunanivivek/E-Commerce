/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface OrderStatusData {
  pending: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface Props {
  orderStatus: OrderStatusData;
  colors: any;
}

export const OrderStatusDonutChart: React.FC<Props> = ({
  orderStatus,
  colors,
}) => {
  const { gray200, gray300, gray600, white, warningColor } = colors;

  const orderStatusData = [
    { name: "Pending", value: orderStatus.pending, color: gray200 },
    { name: "Shipped", value: orderStatus.shipped, color: gray300 },
    { name: "Delivered", value: orderStatus.delivered, color: gray600 },
    { name: "Cancelled", value: orderStatus.cancelled, color: warningColor },
  ];

  const filtered = orderStatusData.filter((i) => i.value > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={6}
          dataKey="value"
          nameKey="name"
          label={({ percent }) => ` ${((percent ?? 0) * 100).toFixed(0)}%`}
        >
          {filtered.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            backgroundColor: white,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          }}
        />

        <Legend wrapperStyle={{ paddingTop: 10, fontSize: 10 }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
