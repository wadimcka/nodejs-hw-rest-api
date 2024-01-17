const express = require("express");

const router = express.Router();

const { validateBody, checkRequestBody } = require("../../middlewares/");

const addContSchema = require("../../schemas");

const ctrl = require("../../controllers/contacts");

router.get("/", ctrl.getAllContacts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateBody(addContSchema), ctrl.addContact);

router.delete("/:contactId", ctrl.deleteContact);

router.put(
  "/:contactId",
  checkRequestBody,
  validateBody(addContSchema),
  ctrl.updateById
);

module.exports = router;
