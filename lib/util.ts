import { cairo, Uint256 } from "starknet";

export function formatAmount(
  amount: string | number,
  decimals: number = 18
): Uint256 {
  const amountStr = amount.toString();
  const [integerPart, decimalPart = ""] = amountStr.split(".");
  const paddedDecimal = decimalPart.padEnd(decimals, "0").slice(0, decimals);
  const amountBN = BigInt(integerPart + paddedDecimal);

  return cairo.uint256(amountBN);
}
