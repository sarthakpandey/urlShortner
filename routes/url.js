const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");
const config = require("config");

const router = express.Router();
const Url = require("../models/Url");

//@route    POST /api/url/shorten
//@desc     Create short url
router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = config.get("baseUrl");

  //Check base url
  if (!validUrl.isUri(baseUrl)) return res.status(401).json("Invalid base url");

  //Create url code
  const urlCode = shortid.generate();

  console.log(req.body)

  //Check long url
  if (!validUrl.isUri(longUrl)) return res.status(401).json("Invalid long url");

  try {
    let url = await Url.findOne({ longUrl });

    if (url) {
      return res.json(url);
    }

    const shortUrl = baseUrl + "/" + urlCode;

    url = new Url({
      longUrl,
      shortUrl,
      urlCode,
      date: new Date()
    });

    await url.save();
    return res.json(url);

  } catch (err) {

    console.error(err.message);
    res.status(500).json("Server error");

  }
});

module.exports = router;
