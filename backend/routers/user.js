const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// get all user data
router.get("/users", async(req, res) => {
    try {
        const data = await prisma.user.findMany({
            include: {
                posts: true,
                comments: true,
            },
            orderBy: { id: "desc" },
            take: 20,
        });
    
        res.status(200).json(data);
    } catch(e) {
        res.status(500).json({ error: e });
    }
});

// get specific user data
router.get("/users/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const data = await prisma.user.findFirst({
            where: { id: Number(id) },
            include: {
                posts: true,
                comments: true,
            },
        });

        res.status(200).json(data);
    } catch(e) {
        res.status(500).json({ error: e });
    }
});

// create new user
router.post("/users", async(req, res) => {
    const { name, username, bio, password } = req.body;

    if(!name || !username || !password) {
        return res.status(400).json({ msg: "name, username and password required." });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, username, password: hash, bio },
        });

        res.json(user);
    } catch(e) {
        res.status(500).json({ error: e });
    }
});

module.exports = { userRouter: router };