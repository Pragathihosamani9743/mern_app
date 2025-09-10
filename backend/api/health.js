// api/health.js
export default function handler(req, res) {
    res.status(200).json({ message: "Backend is running!", timestamp: new Date().toISOString() });
}
