import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const network = "sepolia";

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
  } catch (error: any) {
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return NextResponse.json(
        {
          error: "External API Error",
          status: error.response.status,
          message: error.response.statusText,
          details: error.response.data,
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      // The request was made but no response was received
      return NextResponse.json(
        {
          error: "No response received from external API",
          message: "Request timeout or network error",
        },
        { status: 500 }
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return NextResponse.json(
        {
          error: "Request setup error",
          message: error.message || "Internal Server Error",
        },
        { status: 500 }
      );
    }
  }
}
