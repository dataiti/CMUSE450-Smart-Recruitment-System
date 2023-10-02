const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Address = require("../models/address");
const User = require("../models/user");

const addressById = asyncHandler(async (req, res, next, id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    return res.status(400).json({
      success: true,
      message: "AddressId is invalid",
    });
  }

  const address = await Address.findById(id);

  if (!address)
    return res.status(400).json({
      success: true,
      message: "This address is not found",
    });

  req.address = address;
  next();
});

const getAddressDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get list addresses are successfully",
    data: req.address,
  });
});

const addAddress = asyncHandler(async (req, res) => {
  const { province, district, ward, exactAddress } = req.body;

  if (!province || !district || !ward || !exactAddress)
    throw new Error("All fields are required");

  const newAddress = new Address({
    province,
    ward,
    district,
    exactAddress,
  });
  await newAddress.save();

  return res.status(200).json({
    success: true,
    message: "Add address is successfully",
    data: newAddress,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const { province, district, ward, exactAddress } = req.body;

  const address = await Address.findOneAndUpdate(
    { _id: req.address._id },
    { $set: { province, district, exactAddress, ward } },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Update address is successfully",
    data: address,
  });
});

const removeAddress = asyncHandler(async (req, res) => {
  await Address.findOneAndDelete({ _id: req.address._id });

  return res.status(200).json({
    success: true,
    message: "Delete address is successfully",
  });
});

module.exports = {
  addressById,
  getAddressDetail,
  addAddress,
  updateAddress,
  removeAddress,
};
