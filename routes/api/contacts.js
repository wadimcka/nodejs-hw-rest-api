const express = require("express");

const router = express.Router();

const {
  validateBody,
  checkRequestBody,
  isValidId,
} = require("../../middlewares/");

const ctrl = require("../../controllers/contacts");

const {
  addContactSchema,
  updateStatusSchema,
} = require("../../schemas/contacts");

router.get("/", ctrl.getAllContacts);

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post(
  "/",
  checkRequestBody,
  validateBody(addContactSchema),
  ctrl.addContact
);

router.put(
  "/:contactId",
  isValidId,
  checkRequestBody,
  validateBody(addContactSchema),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite/",
  isValidId,
  checkRequestBody,
  validateBody(updateStatusSchema),
  ctrl.updateStatusContact
);

router.delete("/:contactId", isValidId, ctrl.deleteContact);

module.exports = router;
