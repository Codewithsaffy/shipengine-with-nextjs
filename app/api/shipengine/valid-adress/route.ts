import { NextResponse } from "next/server";
import ShipEngine from "shipengine";

export async function GET(req: Request) {
  const shipengine = new ShipEngine({
    apiKey: "TEST_cCfxGkT6iWPEFbtdeDeyCOHLaC3DO8YTADZ8LLi1GV4",
  });

  try {
    // Validate the address
    const validationResults = await shipengine.validateAddresses([
      {
        name: "Your Name",
        phone: "+92 300 1234567",
        addressLine1: "House 123, XX5M+GMF, Pak Bazar, Orangi Town",
        addressLine2: "Block M Aziz Nagar",
        cityLocality: "Karachi",
        stateProvince: "Sindh",
        postalCode: "74200",
        countryCode: "PK",
      },
    ]);

    return NextResponse.json(validationResults);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to validate address" },
      { status: 500 }
    );
  }
}
