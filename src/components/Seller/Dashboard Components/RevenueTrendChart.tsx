/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine,
} from "recharts";

export const RevenueTrendChart = ({ revenueTrend, colors }: any) => {
  const { primaryColor, gray100, gray200, gray300, gray700, white, errorColor } =
    colors;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={revenueTrend}>
        <defs>
          <linearGradient id="sellerRevenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
            <stop offset="95%" stopColor={primaryColor} stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke={gray100} />
        <XAxis
          dataKey="month"
          tick={{ fill: gray300, fontSize: 12, fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: gray200 }}
        />
        <YAxis
          tick={{ fill: gray300, fontSize: 12, fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: gray200 }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            backgroundColor: white,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            fontSize: "13px",
          }}
          labelStyle={{ fontWeight: 600, color: gray700 }}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke={primaryColor}
          fill="url(#sellerRevenueGradient)"
          strokeWidth={0}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={primaryColor}
          strokeWidth={3}
          dot={{
            fill: primaryColor,
            stroke: white,
            strokeWidth: 3,
            r: 5,
          }}
        />

        <ReferenceLine y={0} stroke={errorColor} strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
};
