import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await axios.post(
      "http://cavos-wallet-provider.vercel.app/api/v1/external/execute",
      {
        network: "sepolia",
        calls: [
          {
            contractAddress: body.targetContractAddress,
            entrypoint: body.entrypoint,
            calldata: body.calldata,
          },
        ],
        address: body.userAddress,
        hashedPk: body.userHashedPk,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CAVOS_API_KEY}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error calling external API",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
