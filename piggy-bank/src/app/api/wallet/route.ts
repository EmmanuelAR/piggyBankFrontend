import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const network = "sepolia";

    const response = await axios.post(
      "http://cavos-wallet-provider.vercel.app/api/v1/external/deploy",
      { network },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "cavos-c78c75073a9fd1cbaf99d696", // tu API KEY aquí
        },
      }
    );

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
