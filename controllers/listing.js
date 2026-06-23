const Listing = require("../models/listing.js");

const { GoogleGenerativeAI } = require(
  "@google/generative-ai"
);

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ======================
// INDEX (All Listings)
// ======================

module.exports.index = async (req, res) => {

  const allListings = await Listing.find({});

  
  res.render(
    "listings/index",
    { allListings }
  );

};

// ======================
// AI SEARCH
// ======================

module.exports.aiSearch = async (req, res) => {

  try {

    const { query } = req.query;

    if (!query) {

      return res.redirect(
        "/listings"
      );

    }

    let searchWords = [];

    try {

      const model =
      genAI.getGenerativeModel({

        model:
        "gemini-2.5-flash",

      });

      const prompt =

        "Convert this travel/property search query into simple keywords. Query: " +

        query +

        ". Return only keywords separated by commas.";

      const result =

      await model.generateContent(
        prompt
      );

      const keywords =

      result.response.text().trim();

      searchWords =

      keywords

      .split(",")

      .map(

        word =>

        word.trim()

      );

    }

    catch {

      searchWords =

      query

      .split(" ")

      .map(

        word =>

        word.trim()

      );

    }

    const allListings =

    await Listing.find({

      $or:[

        {

          title:{

            $regex:

            searchWords.join("|"),

            $options:"i"

          }

        },

        {

          description:{

            $regex:

            searchWords.join("|"),

            $options:"i"

          }

        },

        {

          location:{

            $regex:

            searchWords.join("|"),

            $options:"i"

          }

        },

        {

          country:{

            $regex:

            searchWords.join("|"),

            $options:"i"

          }

        }

      ]

    });

    res.render(

      "listings/index",

      {

        allListings

      }

    );

  }

  catch(err){

    console.log(err);

    req.flash(

      "error",

      "Search Failed"

    );

    res.redirect(

      "/listings"

    );

  }

};

// ======================
// FILTER LISTINGS
// ======================

module.exports.filterListings = async (req, res) => {

  const { type } = req.params;

  let category = "";

  switch (type) {

    case "trending":

      category = "Trending";

      break;

    case "rooms":

      category = "Rooms";

      break;

    case "cities":

      category = "Cities";

      break;

    case "mountains":

      category = "Mountains";

      break;

    case "boats":

      category = "Boats";

      break;

    default:

      return res.redirect("/listings");

  }

  let allListings;

  if (category === "Trending") {

    allListings = await Listing.find({});

  } else {

    allListings = await Listing.find({

      category: category

    });

  }

  res.render(

    "listings/index",

    {

      allListings

    }

  );

};

// ======================
// SHOW (Single Listing)
// ======================

module.exports.showListing = async (

req,

res

) => {

const { id } = req.params;

const listing =

await Listing.findById(id)

.populate("owner")

.populate({

path:"reviews",

populate:{

path:"author"

}

});

if(!listing){

req.flash(

"error",

"Listing you requested does not exist!"

);

return res.redirect(

"/listings"

);

}

res.render(

"listings/show",

{

listing

}

);

};

// ======================
// NEW FORM
// ======================

module.exports.renderNewForm = (

req,

res

) => {

res.render(

"listings/new"

);

};

// ======================
// CREATE LISTING
// ======================

module.exports.createListing = async (

req,

res

) => {

const newListing =

new Listing(

req.body.listing

);

newListing.owner =

req.user._id;

await newListing.save();

req.flash(

"success",

"New Listing Created!"

);

res.redirect(

"/listings"

);

};

// ======================
// EDIT FORM
// ======================

module.exports.renderEditForm = async (

req,

res

) => {

const { id } = req.params;

const listing =

await Listing.findById(id);

if(!listing){

req.flash(

"error",

"Listing does not exist!"

);

return res.redirect(

"/listings"

);

}

res.render(

"listings/edit",

{

listing

}

);

};

// ======================
// UPDATE
// ======================

module.exports.updateListing = async (

req,

res

) => {

const { id } = req.params;

await Listing.findByIdAndUpdate(

id,

{

...req.body.listing

}

);

req.flash(

"success",

"Listing Updated!"

);

res.redirect(

`/listings/${id}`

);

};

// ======================
// DELETE
// ======================

module.exports.destroyListing = async (

req,

res

) => {

const { id } = req.params;

await Listing.findByIdAndDelete(

id

);

req.flash(

"success",

"Listing Deleted!"

);

res.redirect(

"/listings"

);

};
