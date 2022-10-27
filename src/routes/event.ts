import express, { Application, Request, Response } from "express";
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
  newEvent.save()
  res.json("successfully added");
  return 0;
});

//get all events
eventRoutes.get("/", async (req: Request, res: Response) => {
  const events = await Event.find({}).catch((err: Error) => {
    res.send(err);
    return 0;
  });
  res.send(events);
  return 0;
});

//update event
eventRoutes.put("/updateEvent/:id", async (req: Request, res: Response) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid id");
    return 0;
  }

  const event = await Event.findOne({
    _id: req.params.id,
  }).catch((err: Error) => {
    res.send(err);
    return 0;
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
    return 0;
  }).catch((err: Error) => {
    res.send(err);
    return 0;
  });
  res.send("successfully updated");
  return 0;
});

//delete event
eventRoutes.delete("/deleteEvent/:id", async (req: Request, res: Response) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid id");
    return 0;
  }

  const event = await Event.findOne({
    _id: req.params.id,
  }).catch((err: Error) => {
    res.send(err);
    return 0;
  });
  if (!event) {
    res.send("no event found");
    return 0;
  }
  await Event.deleteMany({
    _id: req.params.id,
  }).catch((err: Error) => {
    res.send(err);
    return 0;
  });
  res.send("successfully deleted");
  return 0;
});

//add participant to event
eventRoutes.put("/addParticipants", async (req: Request, res: Response) => {
  const { event_id, participant } = req.body;
  if (!event_id) {
    res.send("event_id must needed in the body");
    return 0;
  }
  if (!event_id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid event id");
    return 0;
  }

  const event = await Event.findOne({
    _id: event_id,
  }).catch((err: Error) => {
    res.send(err);
    return 0;
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
        return 0;
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
    return 0;
  });
  res.send("successfully added.");
  return 0;
});

//remove participant to event
eventRoutes.delete("/removeParticipants", async (req: Request, res: Response) => {
  const { event_id, participant } = req.body;
  if (!event_id) {
    res.send("event_id must needed in the body");
  }
  if (!event_id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid event id");
    return 0;
  }

  const event = await Event.findOne({
    _id: event_id,
  }).catch((err: Error) => {
    res.send(err);
    return 0;
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
    return 0;
  });
  res.send("successfully removed.");
  return 0;
});


//accept participate
eventRoutes.put("/updateAcceptParticipate", async (req: Request, res: Response) => {
  const { event_id, user_id,accept_status } = req.body;
  if (!event_id) {
    res.send("event_id must needed in the body");
    return 0;
  }
  if (!event_id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send("invalid event id");
    return 0;
  }

  const event = await Event.findOne({
    _id: event_id,
  }).catch((err: Error) => {
    res.send(err);
    return 0;
  });
  if (!event) {
    res.send("no event found");
    return 0;
  }
  const userExist = await Event.findOne(
    {
      _id: event_id,"participant.user_id":user_id,
    }
  ).catch((err: Error) => {
    res.send(err);
    return 0;
  });

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
    return 0;
  });
  res.send("successfully updated");
  return 0;
});


//get all event for relevant host
eventRoutes.get("/hostEvent/:id", async (req: Request, res: Response) => {
  
  const events = await Event.find(
    {
      participant : { $elemMatch : { isHost : true , user_id:req.params.id } }
    }
  ).catch((err: Error) => {
    res.send(err);
    return 0;
  });
  res.send(events)
  return 0;

})

//get all event for relevant user
eventRoutes.get("/userEvent/:id", async (req: Request, res: Response) => {
  
  const events = await Event.find(
    {
      "participant.user_id":req.params.id,
    }
  ).catch((err: Error) => {
    res.send(err);
    return 0;
  });
  res.send(events)
  return 0;

})

module.exports = eventRoutes;
