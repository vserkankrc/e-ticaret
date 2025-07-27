import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Get the client's IP address
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
        const userAgent = req.headers['user-agent'];

        // Send the response
        res.json({
            ip: ip,
            userAgent: userAgent
        });
    } catch (error) {
        // Handle any errors
        console.error('Error retrieving client info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;