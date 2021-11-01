export const percentageToValue = ({
  percentage,
  total,
}: {
  percentage: number;
  total: number;
}) => total * percentage;
