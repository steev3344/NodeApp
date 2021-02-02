const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const md5 = require("md5");
const response = require("./response");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "the default secret";
//routes
router.post("/register",(req, res) => createuser(req, res));
router.post("/login", (req, res) => loginuser(req, res));
router.get("/read", (req, res) => readmodel(req, res));
router.get("/read/:id", (req, res) => showmodel(req, res));
router.patch(
  "/update/:id",
  (req, res, next) => userurlupdate(req, res, next),
  (req, res) => updatemodel(req, res)
);
router.delete("/delete/:id", (req, res) => deletemodel(req, res));

//controller
//user registration
const createuser = async function (req, res, next) {
  try {
    // await usercheck(req, res);
    await create(
      Object.assign(
        req.body,
        { password: await md5(req.body.password) },
        { method: "normal" }
      )
    ).then((data) => {
      response.success(res, data);
    });
  } catch (e) {
    response.error(res, e);
  }
};

const socialcreate = async function (req, res, next) {
  try {
    const result = await socialcheck(req.body);
    await create(result).then((data) => {
      response.success(res, data);
    });
  } catch (e) {
    response.error(res, e);
  }
};
const loginuser = async (req, res) => {
  login(req.body)
    .then((data) => {
      response.success(res, data);
    })
    .catch((err) => {
      response.error(res, err);
    });
};

const showmodel = async (req, res) => {
  show(req.params.id)
    .then((data) => {
      response.success(res, data);
    })
    .catch((err) => {
      response.error(res, err);
    });
};

const readmodel = async (req, res) => {
  read(req.body)
    .then((data) => {
      response.success(res, data);
    })
    .catch((err) => {
      response.error(res, err);
    });
};

const updatemodel = async (req, res) => {
  update(req.params.id, req.body)
    .then((data) => {
      response.success(res, data);
    })
    .catch((err) => {
      response.error(res, err);
    });
};
const deletemodel = async (req, res) => {
  remove(req.params.id)
    .then((data) => {
      response.success(res, data);
    })
    .catch((err) => {
      response.error(res, err);
    });
};

//service

const create = async (data) => {
  return new User(data).save();
};
const login = async (data) => {
  return logincheck(data);
};

const read = async (data) => {
  return User.find(data);
};
const show = async (id) => {
  return User.findById(id);
};

const update = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};
const remove = async (id) => {
  await userawsremove(id);
  return User.findByIdAndDelete(id);
};

// const remove = async (data) => {return model.findByIdAndDelete(data)}

//model
const User = mongoose.model("user", {
  username: { type: String, required: false },
  phonenumber: { type: Number, required: false },
  email: { type: String, required: false },
  password: { type: String, required: false },
});
module.exports = { User };
module.exports = router;

// midlewares
usercheck = async function (req, res) {
  try {
    check = await User.findOne({ email: req.body.email });
    check2 = await User.findOne({ phone: req.body.phone });
    if (check) throw Error("Email already exists");
    if (check2) throw Error("Phone already exists");
    if (req.body.password !== req.body.confirm_password)
      throw Error("passwords didnot match");
  } catch (e) {
    throw e;
  }
};
// login token create
const logincheck = async function (user) {
  try {
    const check = await User.findOne({ email: user.email });
    if (check) password = check.password;
    if (!check) throw Error("No Accont found !");
    if (md5(user.password) !== password) throw Error("Invalid password");
    const payload = { id: check.id, username: check.username };
    const token = jwt.sign(payload, secret, { expiresIn: 36000 });
    return {
      method: check.method,
      _id: check._id,
      username:check.username,
      user_authentication: "sucess",
      token,
    };
  } catch (e) {
    throw e;
  }
};
