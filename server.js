// import dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from './firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// GET firebase client config (sourced from server-side .env, not hardcoded in public JS)
app.get('/api/firebase-config', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    });
});


// GET all members
app.get('/api/members', async (req, res) => {
    try {
        const snapshot = await getDocs(collection(db, 'members'));
        const members = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(members);
    } catch (error) {
        console.error("Error getting members:", error);
        res.status(500).json({ error: "Failed to fetch members" });
    }
});

// POST new submission
app.post('/api/submissions', async (req, res) => {
    try {
        const data = req.body;
        // Optionally add server timestamp
        data.submittedAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'submissions'), data);
        res.json({ id: docRef.id, message: "Submission successful" });
    } catch (error) {
        console.error("Error saving submission:", error);
        res.status(500).json({ error: "Failed to save submission" });
    }
});

// POST new request (missing name)
app.post('/api/requests', async (req, res) => {
    try {
        const data = req.body;
        data.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'missingNameRequests'), data);
        res.json({ id: docRef.id, message: "Request successful" });
    } catch (error) {
        console.error("Error saving request:", error);
        res.status(500).json({ error: "Failed to save request" });
    }
});

// GET dashboard stats
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        const membersSnapshot = await getDocs(collection(db, 'members'));
        const submissionsSnapshot = await getDocs(collection(db, 'submissions'));
        const requestsSnapshot = await getDocs(collection(db, 'missingNameRequests'));

        res.json({
            totalMembers: membersSnapshot.size,
            confirmedCount: submissionsSnapshot.size,
            requestCount: requestsSnapshot.size
        });
    } catch (error) {
        console.error("Error getting stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open: http://localhost:${PORT}`);
});
