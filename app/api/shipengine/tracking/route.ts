import { NextRequest } from "next/server";
import ShipEngine from "shipengine";

export async function GET(req:NextRequest) {
  const shipengine = new ShipEngine({
    apiKey: "TEST_cCfxGkT6iWPEFbtdeDeyCOHLaC3DO8YTADZ8LLi1GV4",
  });

  try {
    const label =  await shipengine.trackUsingCarrierCodeAndTrackingNumber(
        {
            carrierCode:"stamps_com",
            trackingNumber:"9405511899563483582582"
        }
    )
    console.log(label)

    return new Response(JSON.stringify(label), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
