import { NextRequest } from "next/server";
import ShipEngine from "shipengine";

export async function POST(req: NextRequest) {
  const shipengine = new ShipEngine({
    apiKey: "TEST_cCfxGkT6iWPEFbtdeDeyCOHLaC3DO8YTADZ8LLi1GV4",
  });

  try {
    const rates = await shipengine.getRatesWithShipmentDetails({
      shipment: {
        shipTo: {
          name: "Muhammad yousuf",
          phone: "+92 300 1234567",
          addressLine1: "House 123, XX5M+GMF, Pak Bazar, Orangi Town",
          addressLine2: "Block M Aziz Nagar",
          cityLocality: "Karachi",
          stateProvince: "Sindh",
          postalCode: "74200",
          countryCode: "PK",
          addressResidentialIndicator: "yes",
        },
        shipFrom: {
          name: "Recipient Name", // Replace with the recipient's name
          phone: "+92 300 1234567", // Replace with the recipient's phone number
          addressLine1: "Aiwan-e-Sadar", // Shortened to fit within 35 characters
          addressLine2: "Civil Lines", // Additional details moved to Address Line 2
          cityLocality: "Karachi",
          stateProvince: "Sindh",
          postalCode: "75580",
          countryCode: "PK",
          addressResidentialIndicator: "yes",
        },
        packages: [
          {
            weight: {
              value: 20,
              unit: "ounce",
            },
            dimensions: {
              height: 6,
              width: 12,
              length: 24,
              unit: "inch",
            },
          },
        ],
      },
      rateOptions: {
        carrierIds: ["se-1553146", "se-1553147", "se-1553148", "se-1553167"],
        // serviceCodes: ["ups_ground"],
      },
    });
    console.log(rates);
    return new Response(JSON.stringify(rates), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
