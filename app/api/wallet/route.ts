import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const network = "sepolia";
    console.log("req", req);

    console.log("process.env.CAVOS_API_KEY", process.env.CAVOS_API_KEY);

    const response = await axios.post(
      "http://cavos-wallet-provider.vercel.app/api/v1/external/deploy",
      { network },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CAVOS_API_KEY}`,
        },
      }
    );

    console.log("response status:", response.status);
    console.log("response data:", response.data);

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    // Something happened in setting up the request that triggered an Error
    return NextResponse.json(
      {
        error: "Request setup error",
        message: error || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
