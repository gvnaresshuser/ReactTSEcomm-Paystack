import { Router } from "express";

const router = Router();

router.get("/reverse", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    const apiKey = process.env.LOCATIONIQ_API_KEY;
    console.log("LOCATIONIQ_API_KEY",apiKey);

    if (!apiKey) {
      console.error("LOCATIONIQ_API_KEY is missing");

      return res.status(500).json({
        success: false,
        message: "LocationIQ API key is not configured",
      });
    }

    const url = new URL(
      "https://us1.locationiq.com/v1/reverse"
    );

    url.searchParams.set("key", apiKey);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("normalizeaddress", "1");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "LocationIQ error:",
        response.status,
        errorText
      );

      return res.status(response.status).json({
        success: false,
        message: "LocationIQ reverse geocoding failed",
      });
    }

    const data = await response.json();

    return res.json({
      success: true,
      address: data.display_name || "",
    });
  } catch (error) {
    console.error(
      "Reverse geocoding error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to get address",
    });
  }
});

export default router;