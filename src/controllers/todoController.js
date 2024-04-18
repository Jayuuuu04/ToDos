import knex from "../config/dbConfig.js";
import Joi from "joi";
const create = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    const data = {
      title,
      description,
      priority,
      status,
    };
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      priority: Joi.string().valid("Low", "Medium", "High").required(),
      status: Joi.string().valid("pending", "completed").required(),
    }).options({ abortEarly: false });
    const validation = schema.validate(data);

    if (validation.error) {
      return res.status(400).json({
        status: "failed",
        message: validation.error.details[0].message,
        data: [],
      });
    }

    const todos = await knex("todos").insert(data);

    if (!todos) {
      return res.status(400).json({
        status: "failed",
        message: "Something went wrong",
        data: [],
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Todo created successfully",
      data: {
        id: todos[0],
        ...data,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
      data: err,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id, title, description, priority, status } = req.body;
    
    const data = {
      id : id,
      title,
      description,
      priority,
      status,
    };
    const schema = Joi.object({
      id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      title: Joi.string(),
      description: Joi.string(),
      priority: Joi.string().valid("low", "medium", "high"),
      status: Joi.string().valid("pending", "completed"),
    }).options({ abortEarly: false });
    const validation = schema.validate({ data });

    if (validation.error) {
      return res.status(400).json({
        status: "failed",
        message: validation.error.details[0].message,
        data: [],
      });
    }
    // console.log("Hello")
    const todos = await knex("todos").update(data).where("id", id);

    if (!todos) {
      return res.status(400).json({
        status: "failed",
        message: "Something went wrong",
        data: [],
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Todo Updated successfully",
      data: {
        id : id,
        ...data,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
      data: err,
    });
  }
};

export default { create, update };
