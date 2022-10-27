import express, { Application, Request, Response } from "express";
import { title } from "process";
const eventRoutes = express.Router();
const Event = require("../schema/eventSchema");

//add new event
eventRoutes.post("/add", async (req: Request, res: Response) => {
  const { title, url, startTime, endTime, participant } = req.body;
  var start = new Date(startTime); // some mock date
  var startMilliseconds = start.getTime();
  var end = new Date(endTime); // some mock date
  var endMilliseconds = end.getTime();

  const newEvent = new Event({
    title: title,
    url: url,
    startTime: startMilliseconds,
    endTime: endMilliseconds,
    participant: participant,
  });
  newEvent.save().catch((err: Error) => {
    res.send(err);
  });
  res.json("successfully added");
  return 0;
});

//get all events
eventRoutes.get("/", async (req: Request, res: Response) => {
  const events = await Event.find({}).catch((err: Error) => {
    res.send(err);
  });
  res.send(events);
});

//update event
eventRoutes.put("/upadateEvent/:id", async (req: Request, res: Response) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid id");
  }

  const event = await Event.findOne({
    _id: req.params.id,
  });
  if (!event) {
    res.send("no event found");
    return 0;
  }
  const { title, url, startTime, endTime } = req.body;
  var start = new Date(startTime); // some mock date
  var startMilliseconds = start.getTime();
  var end = new Date(endTime); // some mock date
  var endMilliseconds = end.getTime();

  await Event.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      title: title ? title : event.title,
      url: url ? url : event.url,
      startTime: startMilliseconds ? startMilliseconds : event.startTime,
      endTime: endMilliseconds ? endMilliseconds : event.endTime,
    }
  ).catch((err: Error) => {
    res.send(err);
  });
  res.send("successfully updated");
});

//delete event
eventRoutes.delete("/deleteEvent/:id", async (req: Request, res: Response) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid id");
  }

  const event = await Event.findOne({
    _id: req.params.id,
  });
  if (!event) {
    res.send("no event found");
    return 0;
  }
  await Event.deleteMany({
    _id: req.params.id,
  });
  res.send("successfully deleted");
});

//add participant to event
eventRoutes.put("/add-paricipants", async (req: Request, res: Response) => {
  const { event_id, participant } = req.body;
  if (!event_id) {
    res.send("event_id must needed in the body");
  }
  if (!event_id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid event id");
  }

  const event = await Event.findOne({
    _id: event_id,
  });
  if (!event) {
    res.send("no event found");
    return 0;
  }
  type ObjectParticipant = {
    user_id: String | undefined;
    accept_status: String | undefined;
    isHost: String | undefined;
    isRequired: String | undefined;
    _id: String | undefined;
  };

  participant.forEach((value: ObjectParticipant)=>{
    event.participant.forEach((object: ObjectParticipant) => {
      if (object.user_id == value.user_id) {
        res.send(`failed.user_id=${value.user_id} is already added.`);
      }
    });
  });

  await Event.findOneAndUpdate(
    {
      _id: event_id,
    },
    { $addToSet: { participant: { $each: req.body.participant } } }
  ).catch((err: Error) => {
    res.send(err);
  });
  res.send("successfully added.");
});

//remove participant to event
eventRoutes.delete("/remove-paricipants", async (req: Request, res: Response) => {
  const { event_id, participant } = req.body;
  if (!event_id) {
    res.send("event_id must needed in the body");
  }
  if (!event_id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid event id");
  }

  const event = await Event.findOne({
    _id: event_id,
  });
  if (!event) {
    res.send("no event found");
    return 0;
  }
/* 
  participant.forEach((value: ObjectParticipant)=>{
    var isExist:Boolean=false;
    for(let i:number=0;i<event.participant.length;i++){
        if(value==event.participant[i].user_id){
          isExist=true
        }
    }
    if(!isExist){
      res.send(`user_id=${value} not exist in this event`)
      return 0
    }
  }); */

  await Event.findOneAndUpdate(
    {
      _id: event_id,
    },
    { $pull: { participant: { user_id:{ $in: participant } } } } 
  ).catch((err: Error) => {
    res.send(err);
  });
  res.send("successfully removed.");
});


//accept participate
eventRoutes.put("/update-accept", async (req: Request, res: Response) => {
  const { event_id, user_id,accept_status } = req.body;
  if (!event_id) {
    res.send("event_id must needed in the body");
  }
  if (!event_id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid event id");
  }

  const event = await Event.findOne({
    _id: event_id,
  });
  if (!event) {
    res.send("no event found");
    return 0;
  }
  const userExist = await Event.findOne(
    {
      _id: event_id,"participant.user_id":user_id,
    }
  );

  if (!userExist) {
    res.send("this user isn't exist in givent event.");
    return 0;
  }

  await Event.findOneAndUpdate(
    {
      _id: event_id,"participant.user_id":user_id,
    },
    { $set: { "participant.$.accept_status" : accept_status } } 
  ).catch((err: Error) => {
    res.send(err);
  });
  res.send("successfully updated");
});


//get all event for relevant host
eventRoutes.get("/host-event/:id", async (req: Request, res: Response) => {
  
  const events = await Event.find(
    {
      participant : { $elemMatch : { isHost : true , user_id:req.params.id } }
    }
  );
  res.send(events)

})

//get all event for relevant user
eventRoutes.get("/user-event/:id", async (req: Request, res: Response) => {
  
  const events = await Event.find(
    {
      "participant.user_id":req.params.id,
    }
  );
  res.send(events)

})

module.exports = eventRoutes;
