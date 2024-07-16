import UserModel from "../../models/user.model.js";



class UserDao {

    async crateUser (data) {
        try {
            const user = await UserModel.create(data);
            return user;
        } catch (error) {
            throw new Error ("(DAO) Error al crear Usuario");
        }
    }

    async updateUser(id, data) {
        try {
            const user = await UserModel.findByIdAndUpdate(id, data);
            return user;
        } catch (error) {
            throw new Error ("(DAO) Error al actualizar Usuario");
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.findById(id);
            return user;
        } catch (error) {
            throw new Error ("(DAO) Error al buscar Usuario");
        }
    }

    async getUserByEmail(mail) {
        try {
            const user = await UserModel.findOne(mail);
            return user;
        } catch (error) {
            throw new Error ("(DAO) Error al buscar Usuario");
        }
    }

    async updateuserByEmail (mail, data) {
        try {
            const user = await UserModel.findOneAndUpdate(mail, data);
            return user;
        } catch (error) {
            throw new Error ("(DAO) Error al actualizar Usuario por email");
        }
    }
}

export default UserDao;