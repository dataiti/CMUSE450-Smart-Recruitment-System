const Employer = require("../models/employer");
const Address = require("../models/address");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const employerById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "Employer Id is invalid",
    });
  }

  const employer = await Employer.findById(id).populate("addressId");

  if (!employer)
    return res.status(400).json({
      success: true,
      message: "Employer is not find",
    });

  req.employer = employer;
  next();
});

const getEmployerDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get employer detail is successfully",
    data: req.employer,
  });
});

const registerEmployer = asyncHandler(async (req, res) => {
  const companyLogo = req.file.path;
  const publicId = req.file.filename;

  const {
    companyName,
    companyEmail,
    companyPhoneNumber,
    websiteUrl,
    companyIndustry,
    companySize,
    companyLocation,
    companyDescription,
  } = req.body;

  const newAddress = new Address({
    province: req.body.province,
    ward: req.body.ward,
    district: req.body.district,
    exactAddress: req.body.exactAddress,
  });

  await newAddress.save();

  if (!newAddress) throw new Error("Create job is fail");

  const newEmployer = new Employer({
    ownerId: req.user._id,
    addressId: newAddress._id,
    companyLogo,
    publicId,
    companyName,
    companyEmail,
    companyPhoneNumber,
    websiteUrl,
    companyIndustry,
    companySize,
    companyLocation,
    companyDescription,
  });

  await newEmployer.save();

  if (!newEmployer) throw new Error("Register employer is fail");

  req.user.ownerEmployerId = newEmployer._id;
  req.user.save();

  return res.status(200).json({
    success: true,
    message: "Register employer is successfully",
    data: newEmployer,
  });
});

const editEmployer = asyncHandler(async (req, res) => {
  const newAddress = new Address({
    province: req.body.province,
    ward: req.body.ward,
    district: req.body.district,
    exactAddress: req.body.exactAddress,
  });

  await newAddress.save();

  if (!newAddress) throw new Error("Create job is fail");

  const updateEmployer = await Employer.findOneAndUpdate(
    { _id: req.employer._id },
    { $set: { addressId: newAddress } },
    { new: true }
  );

  if (!updateEmployer) throw new Error("Register employer is fail");

  return res.status(200).json({
    success: true,
    message: "Register employer is successfully",
    data: updateEmployer,
  });
});

const deleteEmployer = asyncHandler(async (req, res) => {
  const deleteCandidate = await Candidate.findOneAndDelete({
    _id: req.candidate.candidateId,
  });

  if (!deleteCandidate) throw new Error("Delete candidate is fail");

  return res.status(200).json({
    success: true,
    message: "Delete candidate is successfully",
  });
});

const getListOfEmployerForAdmin = asyncHandler(async (req, res) => {
  const { query } = req;
  const status = query.status ? query.status : "";
  const search = query.search || "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const sortBy = query.sortBy || "-_id";
  const orderBy = ["asc", "desc"].includes(query.orderBy)
    ? query.orderBy
    : "asc";
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const companyIndustry = req.query.companyIndustry
    ? req.query.companyIndustry
    : -1;
  const companySize = req.query.companySize ? req.query.companySize : -1;

  const filterArgs = {
    $or: [
      { companyName: { $regex: regex, $options: "i" } },
      { companyEmail: { $regex: regex, $options: "i" } },
      { companyPhoneNumber: { $regex: regex, $options: "i" } },
      { companyLocation: { $regex: regex, $options: "i" } },
      { companyDescription: { $regex: regex, $options: "i" } },
    ],
  };

  if (status) filterArgs.status = status;
  if (companySize !== -1) filterArgs.companySize = companySize;
  if (companyIndustry !== -1) filterArgs.companyIndustry = companyIndustry;

  const countEmployer = await Employer.countDocuments(filterArgs);

  if (!countEmployer) throw new Error("List employer is not find");

  const totalPage = Math.ceil(countEmployer / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const listEmployers = await Employer.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    message: "Get list of employers are successfully",
    currentPage: page,
    totalPage,
    countEmployer,
    data: listEmployers,
  });
});

module.exports = {
  employerById,
  getEmployerDetail,
  registerEmployer,
  editEmployer,
  deleteEmployer,
  getListOfEmployerForAdmin,
};
