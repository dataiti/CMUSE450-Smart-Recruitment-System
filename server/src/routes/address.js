const express = require("express");
const {
  addressById,
  getAddressDetail,
  addAddress,
  updateAddress,
  removeAddress,
} = require("../controllers/address");

const router = express.Router();

router.get("/get-address-detail/:addressId", getAddressDetail);
router.post("/create-address", addAddress);
router.put("/edit-address/:addressId", updateAddress);
router.delete("/delete-address/:addressId", removeAddress);

router.param("addressId", addressById);

module.exports = router;
