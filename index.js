// 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

const { Configuration, OpenAIApi } = require("openai");
const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const configuration = new Configuration({
  organization: "org-irt3oqStBNRCB9BvGIdFVpVl",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// create a simple express api that calls the function above

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3080;

app.post("/", async (req, res) => {
  const { message, currentModels } = req.body;
  console.log(message, "this is the message");

  const response = await openai.createCompletion({
    model: `${currentModels}`,
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  });
  res.json({
    message: response.data.choices[0].text,
  });
});

app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  console.log(response.data.data);
  res.json({
    models: response.data.data,
  });
});

app.listen(port, () => {
  console.log(`It worked, the app is listening at http://localhost:${port}`);
});
