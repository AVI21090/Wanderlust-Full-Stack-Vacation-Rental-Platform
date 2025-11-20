const listings = require("./models/listings") ;
const Review = require("./models/review") ;
const {listingSchema, reviewSchema }= require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
module.exports.LoggedIn = (req, res, next) => {

    if (!req.Authenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "you must be logged in to create listings!");
        return res.redirect("/login")
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=> {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req , res , next)=> {
    let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!currUser && listing.owner.equals(res.local.currUser._id)){
    req.flash("error", "You are not the owner of this listing");
   return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports. validateReview =(req, res, next)=> {
 let {error} = ReviewSchema.validate(req.body);

   if(error){
    let errmsg = error.details.map((el) => el.message).join(","); 
    throw new ExpressError(400, errMsg);
   } else {
next();
   }
};


module.exports. validateReview =(req, res, next)=> {
 let {error} = ReviewSchema.validate(req.body);

   if(error){
    let errmsg = error.details.map((el) => el.message).join(","); 
    throw new ExpressError(400, errMsg);
   } else {
next();
   }
};

module.exports.isReviewAuthor = async (req , res , next)=> {
    let { id,reviewId } = req.params;
  let review = await Review.findById(reviewIdd);
  if(!review.author.equals(res.local.currUser._id)){
    req.flash("error", "You are not the author of this Review");
   return res.redirect(`/listings/${id}`);
  }
  next();
};