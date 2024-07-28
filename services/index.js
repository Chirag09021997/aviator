const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const methods = {
    get: async (model, query, additional = undefined) => {
        return model.findOne(query, additional || undefined);
    },

    // getAll: async (model, query, limit = 1000, offset = 0) => {
    //     return model.findAll({ ...query, limit, offset });
    // },

    getAll: async (model, query) => {
        return model.findAll({ ...query });
    },

    create: async (model, data, additional = undefined) => {
        return model.create(data, additional || undefined);
    },

    update: async (model, query, data, additional = undefined) => {
        return model.update(data, query, additional || undefined);
    },

    delete: async (model, query, additional = undefined) => {
        return model.destroy(query, additional || undefined);
    },

    generateHashPassword: async (myPassword, salt) => {
        return await bcrypt.hashSync(myPassword, salt);
    },

    passwordCompare: async (myPassword, hash, additional = undefined) => {
        return await bcrypt.compareSync(myPassword, hash, additional || undefined);
    },

    generateToken: (detail) => {
        let token = jwt.sign(
            {
                id: detail?.id,
                email: detail?.email,
                name: detail?.name,
                profile: detail?.profile,
            },
            process.env.JWT_SECRET_KEY || "jwtTokenGenerate",
            { expiresIn: process.env.EXPIRES_IN || "1D" }
        );
        return token;
    },

    verifyToken: async (token) => {
        if (!token) return null;
        try {
            return jwt.verify(
                token,
                process.env.JWT_SECRET_KEY || "jwtTokenGenerate"
            );
        } catch (error) {
            return null;
        }
    },
};

module.exports = { methods };
