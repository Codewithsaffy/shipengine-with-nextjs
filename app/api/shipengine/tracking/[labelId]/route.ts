import { shipengine } from "@/lib/helper/shipEngine";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: {
  params: Promise<{ labelId: string }>
}) {
  const labelId = (await params).labelId;
  if (!labelId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    // you have two options to track
    // you can track using label id
    const label = await shipengine.trackUsingLabelId(labelId);
    // or
    // you can track using carrier code and tracking number
    // const label = await shipengine.trackUsingCarrierCodeAndTrackingNumber({
    //   carrierCode: "carrier code", // Replace with the actual carrier code
    //   trackingNumber: "tracking number", // Replace with the actual tracking number
    // });

    console.log(label);

    return NextResponse.json(label, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
