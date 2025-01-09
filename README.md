# ShipEngine with Next.js

## Table of Contents

- [My Self Introduction](#introduction)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
- [Setting Up ShipEngine](#setting-up-shipengine)  
  - [Getting Your Test API Key](#getting-your-test-api-key)  
  - [Setting Environment Variables](#setting-environment-variables)  
- [Usage](#usage)  
  - [Creating Shipment Rates](#creating-shipment-rates)  
  - [Generating Labels](#generating-labels)  
  - [Tracking Shipments](#tracking-shipments)  
- [Conclusion](#conclusion)


---

## Introduction

Hi, I'm **Muhammad Yousuf**, a passionate web developer and a leader student at GIAIC (Governor of Sindh’s IT Course). I specialize in building modern, responsive, and high-performance web applications using **Next.js**, **Tailwind CSS**, and **TypeScript**.

---

## Getting Started

### Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**
- **Next.js**
- **Tailwind CSS**
- **TypeScript**

### Installation

#### Step 1: Create a Next.js Application

```bash
npx create-next-app@latest my-app
```

#### Step 2: Install ShipEngine

```bash
npm install shipengine
```

---

## Setting Up ShipEngine

### Getting Your Test API Key

Follow these steps to obtain your ShipEngine test API key:

1. **Create an account** at [ShipEngine](https://www.shipengine.com/).
   
   ![Sign-up Image](/public/signup.png)

2. Verify your email through the link sent by ShipEngine.

3. Log in to your account.

   ![Login Image](/public/login.png)

4. Select the free plan.

   ![Plan Selection Image](/public/plan.png)

5. On the dashboard, click on "Enable Later" if prompted.

   ![Enable Later Image](/public/enable.png)

6. Copy your API key from the [dashboard](https://dashboard.shipengine.com) or [generate new API key](https://dashboard.shipengine.com/api-keys).



   ![API Key Image](/public/key.png)

### Setting Environment Variables

Create an `.env.local` file in your project and add the following variables:

```ts
SHIPENGINE_API_KEY="YOUR_API_KEY"
SHIPENGINE_FIRST_COURIER="your_first_carrier_code"
SHIPENGINE_SECOND_COURIER="your_second_carrier_code"
SHIPENGINE_THIRD_COURIER="your_third_carrier_code"
SHIPENGINE_FOURTH_COURIER="your_fourth_carrier_code"
```

To get carrier codes, refer to this page:

![Carrier Codes Image](/public/carrier.png)

---

## Usage

### Creating Shipment Rates

#### Step 1: Create a Reusable ShipEngine Object

Create a helper file named `helper/shipEngine.ts`:

```typescript
import ShipEngine from "shipengine";

const shipEngine = new ShipEngine({
  apiKey: process.env.SHIPENGINE_API_KEY,
});

export { shipEngine };
```

#### Step 2: Create the API Endpoint

<mark>In test mode, you can use address of country which you have been selected in creating account </mark>

Create a file `api/shipengine/get-rates/route.ts`:

```typescript
import { shipEngine } from "@/helper/shipEngine";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { shipToAddress, packages } = await req.json();
  try {
    const shipmentDetails = await shipEngine.getRatesWithShipmentDetails({
      shipment: {
        shipTo: shipToAddress,
        shipFrom: {
          name: "John Doe",
          phone: "+1 555 123 4567",
          addressLine1: "742 Evergreen Terrace",
          addressLine2: "Apt 101",
          cityLocality: "Springfield",
          stateProvince: "IL",
          postalCode: "62701",
          countryCode: "US",
          addressResidentialIndicator: "no",
        },
        packages: packages,
      },
      rateOptions: {
        carrierIds: [
          process.env.SHIPENGINE_FIRST_COURIER || "",
          process.env.SHIPENGINE_SECOND_COURIER || "",
          process.env.SHIPENGINE_THIRD_COURIER || "",
          process.env.SHIPENGINE_FOURTH_COURIER || "",
        ].filter(Boolean),
      },
    });

    return new Response(JSON.stringify(shipmentDetails), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
```

#### Step 3: Call the API Endpoint from the Frontend

In your frontend component (e.g., `shipment.tsx`):

```typescript
const response = await fetch("/api/shipengine/get-rates", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    shipToAddress: {
      name: "Michael Smith",
      phone: "+1 555 987 6543",
      addressLine1: "456 Oak Avenue",
      addressLine2: "Suite 200",
      cityLocality: "Los Angeles",
      stateProvince: "CA",
      postalCode: "90001",
      countryCode: "US",
      addressResidentialIndicator: "no",
    },
    packages: [
      { weight: { value: 5, unit: "ounce" }, dimensions: { height: 3, width: 15, length: 10, unit: "inch" } },
    ],
  }),
});

const data = await response.json();
console.log(data);
```

#### Example Response

![Response Data Image](/public/rates.png)

### Generating Labels

#### Step 1: Create the API Endpoint

Create a file `api/shipengine/create-label/route.ts`:

```typescript
import { shipEngine } from "@/helper/shipEngine";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { rateId } = await req.json();
    const label = await shipEngine.createLabelFromRate({ rateId });
    return NextResponse.json(label, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while creating the label" },
      { status: 500 }
    );
  }
}
```

#### Step 2: Call the API Endpoint from the Frontend

In your frontend component:

```typescript
const response = await fetch("/api/shipengine/create-label", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ rateId: "YOUR_RATE_ID" }),
});

const data = await response.json();
console.log(data);
```

#### Example Label Response

![Label Image](/public/label.png)

##### Label Image Example

![Label Image](/public/labelPdf.png)

### Tracking Shipments

#### Step 1: Create the API Endpoint

<mark>In test mode, shipengine will not track shipment </mark>

Create a file `api/shipengine/track-shipment/route.ts`:

you can track order in two ways:
- using label id
```typescript
import { shipengine } from "@/lib/helper/shipEngine";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { labelId: string } }
) {
  const labelId = await params.labelId;
  }

  try {
    const label = await shipengine.trackUsingLabelId(labelId);

    return NextResponse.json(label, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }

```

- using carrier code and tracking number
```typescript
import { shipengine } from "@/lib/helper/shipEngine";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { carrierCode: string; trackingNumber: string } }
) {
  const carrierCode = await params.carrierCode;
  const trackingNumber = await params.trackingNumber;
  }

  try {
    const label = await shipengine.trackUsingCarrierCodeAndTrackingNumber(
      {carrierCode,
      trackingNumber}
    );

    return NextResponse.json(label, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
```
#### Step 2: Call the API Endpoint from the Frontend

In your frontend component:

```typescript
const response = await fetch(`/api/shipengine/tracking/${labelId}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

const data = await response.json();
console.log(data);
```

#### Example Tracking Response
<mark>In test mode, shipengine will not track shipment </mark>
![Tracking Image](/public/tracking.png) 

---
### Conclusion
This guide helps you set up ShipEngine with your Next.js app, from getting API keys to creating shipments, printing labels, and tracking orders. By following these steps, you can make your shipping process simple and efficient. If you have any questions, check out the ShipEngine Documentation or contact their support team. Good luck! 😊


