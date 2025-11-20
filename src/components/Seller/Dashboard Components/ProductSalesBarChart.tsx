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

interface ProductSalesDataPoint {
  productName: string;
  unitsSold: number;
}

interface Props {
  productSales: ProductSalesDataPoint[];
  colors: any;
}

export const ProductSalesBarChart: React.FC<Props> = ({
  productSales,
  colors,
}) => {
  const { gray100, gray200, gray300, white, successColor } = colors;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={productSales}>
        <CartesianGrid strokeDasharray="3 3" stroke={gray100} />

        <XAxis
          dataKey="productName"
          tick={{ fill: gray300, fontSize: 12, fontWeight: 500 }}
        />
        <YAxis tick={{ fill: gray300, fontSize: 12, fontWeight: 500 }} />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            background: white,
          }}
        />

        <Bar
          dataKey="unitsSold"
          fill={successColor}
          radius={[8, 8, 0, 0]}
          barSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
