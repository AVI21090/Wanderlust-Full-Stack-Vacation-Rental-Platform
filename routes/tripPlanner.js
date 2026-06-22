const express = require("express");
const router = express.Router();

const { LoggedIn } = require("../middleware");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ======================
// SHOW PAGE
// ======================

router.get("/", LoggedIn, (req, res) => {
  res.render("tripPlanner/index", {
    aiResponse: null,
  });
});

// ======================
// GENERATE AI PLAN
// ======================

router.post("/", LoggedIn, async (req, res) => {
  try {
    const { budget, days, preference } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert travel planner.

Budget: ₹${budget}
Days: ${days}
Preference: ${preference}

Generate:
1. Best destination
2. Budget breakdown
3. Day-wise itinerary
4. Places to visit
5. Travel tips

Keep the response clean and easy to read.
`;

    const result = await model.generateContent(prompt);

    const aiResponse = result.response.text();

    res.render("tripPlanner/index", {
      aiResponse,
    });
  } catch (err) {
    console.log("========== GEMINI ERROR ==========");
    console.log(err);
    console.log("==================================");

    res.render("tripPlanner/index", {
      aiResponse:
        "AI Trip Planner failed. Check terminal logs.",
    });
  }
});

module.exports = router;