const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const ToDoList = require("../models/ToDoList");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Fetch all events POST at "/api/list/fetchallevents". Login required.
router.post("/fetchallevents", fetchuser, async (req, res) => {
  try {
    const events = await ToDoList.find({ user: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// ROUTE 2: Add events POST at "/api/list/addevent". Login required.
router.post(
  "/addevent",
  fetchuser,
  [
    // Express validator validations.
    body("task", "Task must be minimum 5 characters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { task, status, priority } = req.body;

      // Express validator throws error if values are not matching.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let event_status = false;
      if (status == "completed") {
        event_status = true;
      } else {
        event_status = false;
      }
      // Storing new event in database with respect to user id.
      const event = new ToDoList({
        user: req.user.id,
        task,
        status: event_status,
        priority,
      });

      // Saving user in database
      const saved_events = await event.save();

      res.json(saved_events);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Mark completed to events PUT at "/api/list/updateevent/:id". Login required.
router.put("/updateevent/:id", fetchuser, async (req, res) => {
  const { task, status, priority } = req.body;
  try {
    let new_status = false;
    // New event object.
    const new_event = {};
    if (status == "completed") {
      new_status = true;
    }
    if (status) {
      new_event.status = new_status;
    }

    // Find event which have to update and update it.
    let event = await ToDoList.findById(req.params.id);
    if (!event) {
      return res.status(404).send("Not found");
    }

    // Checking user who updating event.
    if (event.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    event = await ToDoList.findByIdAndUpdate(
      req.params.id,
      { $set: new_event },
      { new: true }
    );
    res.json(event);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4: Delete events DELETE at "/api/list/deleteevent/:id". Login required.
router.delete("/deleteevent/:id", fetchuser, async (req, res) => {
  try {
    // Find event which have to delete and delete it.
    let event = await ToDoList.findById(req.params.id);
    if (!event) {
      return res.status(404).send("Not found");
    }

    // Checking user who delete event.
    if (event.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    event = await ToDoList.findByIdAndDelete(req.params.id);
    res.json({ message: "Event has been deleted successfully", event: event });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// ROUTE 5: Fetch completed events POST at "/api/list/completed". Login required.
router.post("/completed", fetchuser, async (req, res) => {
  try {
    const events = await ToDoList.find({ user: req.user.id }).where('status').equals(true);
    res.json(events);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// ROUTE 5: Fetch pending events POST at "/api/list/pending". Login required.
router.post("/pending", fetchuser, async (req, res) => {
  try {
    const events = await ToDoList.find({ user: req.user.id }).where('status').equals(false);
    res.json(events);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
