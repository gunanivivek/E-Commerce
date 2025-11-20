/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CouponPerformanceDataPoint {
  code: string;
  usage: number;
}

interface Props {
  couponPerformance: CouponPerformanceDataPoint[];
  colors: any;
}

export const CouponPerformanceBarChart: React.FC<Props> = ({
  couponPerformance,
  colors,
}) => {
  const { gray100, gray200, gray300, gray600, white, primaryColor } = colors;

  return (
    <ResponsiveContainer width="102%" height={300}>
      <BarChart
        data={couponPerformance}
        layout="vertical"
        margin={{ top: 10, right: 100, bottom: 10, left: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gray100} />

        <XAxis type="number" tick={{ fill: gray300, fontSize: 13 }} />
        <YAxis
          type="category"
          dataKey="code"
          tick={{ fill: gray600, fontSize: 12, fontWeight: 500 }}
          tickFormatter={(value) => value.slice(0, 7)}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            backgroundColor: white,
          }}
        />

        <Bar
          dataKey="usage"
          fill={primaryColor}
          barSize={22}
          radius={[6, 6, 6, 6]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
