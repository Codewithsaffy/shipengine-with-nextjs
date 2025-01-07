import { NextRequest } from "next/server";
import ShipEngine from "shipengine";

export async function POST(req:NextRequest) {
  const shipengine = new ShipEngine({
    apiKey: "TEST_cCfxGkT6iWPEFbtdeDeyCOHLaC3DO8YTADZ8LLi1GV4",
  });

  try {
    const label =  await shipengine.createLabelFromRate(
        {
            rateId:"se-49541656"
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
