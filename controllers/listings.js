 const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const { search, filter } = req.query;

  const mongoQuery = {};

  if (search && search.trim() !== "") {
    const searchTerm = search.trim();
    mongoQuery.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { location: { $regex: searchTerm, $options: "i" } },
      { country: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } }
    ];
  }

  const selectedFilter = filter || "trending";

  if ((!search || search.trim() === "") && selectedFilter !== "all") {
    mongoQuery.category = selectedFilter.toLowerCase();
  }

  let allListings = await Listing.find(mongoQuery);
  let noCategoryResults = false;

  if (allListings.length === 0 && (!search || search.trim() === "") && selectedFilter !== "all") {
    noCategoryResults = true;
    mongoQuery.category = "trending";
    allListings = await Listing.find(mongoQuery);
  }

  res.render("listings/index", {
    allListings,
    searchTerm: search || "",
    currentFilter: selectedFilter.toLowerCase(),
    noCategoryResults,
    success: res.locals.success || [],
    error: res.locals.error || [],
    currentUser: res.locals.currentUser || null,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new", {
    success: res.locals.success || [],
    error: res.locals.error || [],
    currentUser: res.locals.currentUser || null,
  });
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  if (
    listing.location &&
    (!listing.geometry ||
      !Array.isArray(listing.geometry.coordinates) ||
      listing.geometry.coordinates.length !== 2)
  ) {
    try {
      const geoData = await geocodingClient
        .forwardGeocode({
          query: listing.location,
          limit: 1,
        })
        .send();

      const feature = geoData.body.features?.[0];
      if (feature && feature.geometry) {
        listing.geometry = feature.geometry;
        await listing.save();
      }
    } catch (err) {
      console.error("Error backfilling geometry for listing", id, err);
    }
  }

  res.render("listings/show", {
    listing,
    success: res.locals.success || [],
    error: res.locals.error || [],
    currentUser: res.locals.currentUser || null,
  });
};

module.exports.createListing = async (req, res) => {
  const geoData = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const listing = new Listing(req.body.listing);

  listing.geometry = geoData.body.features[0].geometry;

  listing.owner = req.user._id;

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_250"
  );

  res.render("listings/edit", {
    listing,
    originalImageUrl,
    success: res.locals.success || [],
    error: res.locals.error || [],
    currentUser: res.locals.currentUser || null,
  });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
