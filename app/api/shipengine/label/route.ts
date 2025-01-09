import { shipengine } from "@/lib/helper/shipEngine";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler to create a shipping label from a rate ID.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the JSON body of the request to extract the rateId
    const { rateId } = await req.json();

    // // Validate that rateId is provided
    if (!rateId) {
      return NextResponse.json(
        { error: "rateId is required" },
        { status: 400 }
      );
    }

    // Use the ShipEngine SDK to create a label from the provided rateId
    const label = await shipengine.createLabelFromRate({
      rateId,
    });

    // Log the label data for debugging purposes
    console.log("Label created successfully:", label);

    // Return the label data as a JSON response with a 200 status code
    return NextResponse.json(label, { status: 200 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error creating label:", error);

    // Return a generic error message with a 500 status code
    return NextResponse.json(
      { error: "An error occurred while creating the label" },
      { status: 500 }
    );
  }
}
