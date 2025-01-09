import ShipEngine from "shipengine";

export const shipengine = new ShipEngine({
    apiKey: process.env.SHIPENGINE_API_KEY as string,
  });