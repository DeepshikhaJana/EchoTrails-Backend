import userModel from "../Models/userModel.js";

const loginUser = async(req, res) => {
    res.json({msg: "login user"})
}

const logoutUser = async(req, res) => {

}

export {loginUser, logoutUser}