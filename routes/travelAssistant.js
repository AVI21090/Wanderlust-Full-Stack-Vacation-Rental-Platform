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
  res.render("travelAssistant/index", {
    aiResponse: null,
  });
});

// ======================
// ASK AI
// ======================

router.post("/", LoggedIn, async (req, res) => {
  try {

    const { question } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert travel assistant.

Answer the following travel question:

${question}

Keep the answer helpful, short and easy to understand.
`;

    const result =
      await model.generateContent(prompt);

    const aiResponse =
      result.response.text();

    res.render("travelAssistant/index", {
      aiResponse,
    });

  } catch (err) {

    console.log(err);

    res.render("travelAssistant/index", {
      aiResponse:
        "AI Assistant is unavailable right now.",
    });
  }
});

module.exports = router;