import { Webhook } from "svix";
import User from "../models/User.js";
import { EventsApiRequestFactory } from "svix/dist/openapi/apis/EventsApi.js";

// Api Controler Funciton to manage cleerk user uwth datase

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const payload = JSON.stringify(req.body);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(payload, headers);

    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);

        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.imaga_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        res.json({});

        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);

        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};
