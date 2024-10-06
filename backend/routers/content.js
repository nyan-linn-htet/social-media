const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// get all post data
router.get("/posts", async(req, res) => {
    try {
        const data = await prisma.post.findMany({
            include: {
                user: true,
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

// get specific post data
router.get("/posts/:id", async(req, res) => {
    const { id } = req.params;

    try {
        const data = await prisma.post.findFirst({
            where: { id: Number(id) },
            include: {
                user: true,
                comments: {
                    include: { user: true },
                },
            },
        });

        res.status(200).json(data);
    } catch(e) {
        res.status(500).json({ error: e });
    }
});

// delete post data
router.delete("/posts/:id", async(req, res) => {
    const { id } = req.params;

    await prisma.comment.deleteMany({
        where: { postId: Number(id) },
    });

    await prisma.post.delete({
        where: { id: Number(id) },
    });

    res.sendStatus(204);
});

// delete comment data
router.delete("/comments/:id", async(req, res) => {
    const { id } = req.params;

    await prisma.comment.delete({
        where: { id: Number(id) },
    });

    res.sendStatus(204);
});

module.exports = { contentRouter: router };