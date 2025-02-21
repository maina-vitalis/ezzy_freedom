import { NextRequest, NextResponse } from "next/server";

// Handle M-Pesa Callback
export async function POST(req: NextRequest) {
  try {
    const callbackData = await req.json();
    console.log("🔔 M-Pesa Callback Data:", callbackData);

    // Validate request
    if (!callbackData.Body || !callbackData.Body.stkCallback) {
      return NextResponse.json(
        { message: "Invalid callback data" },
        { status: 400 }
      );
    }

    //data preparation

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log("❌ Error handling callback:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
