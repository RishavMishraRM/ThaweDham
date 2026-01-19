import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image, mimeType, targetLang } = req.body;

    if (!image || !mimeType || !targetLang) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`Received request: mimeType=${mimeType}, targetLang=${targetLang}, imageSize=${image.length} chars`);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key not configured on server' });
    }
    console.log(`API Key loaded: ${apiKey.substring(0, 5)}...`);

    try {
        console.log("Initializing Gemini AI...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Using model: gemini-1.5-flash");

        const prompt = `This is an image containing text in Kaithi script. Please transliterate it and then translate it into ${targetLang}. 
                   Format the output nicely. If the content is a legal record or land record (common for Kaithi), explain the key details.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: image,
                    mimeType: mimeType
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text });
    } catch (error) {
        console.error("Gemini Error:", error);
        return res.status(500).json({
            error: 'Failed to process document',
            details: error.message
        });
    }
}
