import knex from "../config/dbConfig.js";
import Joi from "joi";
const createTodo = async (req, res) => {
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

const updateTodo = async (req, res) => {
  try {
    const { id, title, description, priority, status } = req.body;

    const data = {
      id,
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

    const validation = schema.validate(data);

    if (validation.error) {
      return res.status(400).json({
        status: "failed",
        message: validation.error.details[0].message,
        data: [],
      });
    }

    const todos = await knex("todos").update(data).where("id", id);

    if (!todos) {
      return res.status(400).json({
        status: "failed",
        message: "Something went wrong",
        data: [],
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Todo Updated successfully",
      data: {
        id,
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

const deleteTodo = async (req, res) => {
  const { id } = req.body;

  const schema = Joi.object({
    id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      status: "failed",
      message: validation.error.details[0].message,
      data: [],
    });
  }

  const existingTodo = await knex("todos")
    .where({
      id,
      is_deleted: 0,
    })
    .first();

  if (!existingTodo) {
    return res.status(404).json({
      status: "failed",
      message: "Todo not found or already Deleted...",
      data: [],
    });
  }

  const todos = await knex("todos").where("id", id).update({
    is_deleted: true,
  });

  if (!todos) {
    return res.status(400).json({
      status: "failed",
      message: "Something went wrong",
      data: [],
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Todo deleted successfully",
    data: `Deleted ID  is : ${id}`,
  });
};


const listTodo = async (req, res) => {
  const { page = 1, perPage = 10,  search = '', status = '' } = req.body;

  const offset = (page - 1) * perPage;

  try {
    let query = knex("todos").select("*").where('is_deleted', '=', 0);

    if(search){
      query = query.where(function () {
        this.where('title', 'like', `%${search}%`)
            .orWhere('description', 'like', `%${search}%`)
            .orWhere('priority', 'like', `%${search}%`);
      });
    }
    if (status) {
      query = query.andWhere('status', '=', status);
    }
    const todos = await query.limit(perPage).offset(offset).orderBy("id", "desc");
    if (!todos.length) {
      return res.status(404).json({
        error: true,
        message: "No Record Found!!!",
      });
    }
    return res.status(200).json({
      error: false,
      message: "Todos Paginated Successfully!!",
      data: todos,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!!! Failed to paginate users",
      data: err.message,
    });
  }
};

export default { createTodo, updateTodo, deleteTodo, listTodo };
