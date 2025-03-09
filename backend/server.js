require("dotenv").config();
console.log(`API Key Loaded: ${process.env.GEMINI_API_KEY ? "✅ Yes" : "❌ No"}`);

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise"); // Using promise-based mysql
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generationConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "cryptichackerspirit11",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Connected to MySQL Database");
        connection.release();
    } catch (err) {
        console.error("❌ Database Connection Failed:", err);
    }
})();

// Function to calculate player stats
const calculatePlayerStats = (player) => {
    try {
        // Calculate batting stats
        const battingStrikeRate = player.balls_faced > 0 ? (player.total_runs / player.balls_faced) * 100 : 0;
        const battingAverage = player.innings_played > 0 ? player.total_runs / player.innings_played : 0;
        
        // Calculate bowling stats
        const totalBallsBowled = player.overs_bowled * 6;
        const bowlingStrikeRate = player.wickets > 0 ? totalBallsBowled / player.wickets : 0;
        const economyRate = totalBallsBowled > 0 ? (player.runs_conceded / totalBallsBowled) * 6 : 0;
        
        // Calculate points
        const battingPoints = (battingStrikeRate / 5) + (battingAverage * 8);
        const bowlingPoints = bowlingStrikeRate > 0 ? (500 / bowlingStrikeRate) : 0;
        const economyPoints = economyRate > 0 ? (140 / economyRate) : 0;
        
        const totalPoints = battingPoints + bowlingPoints + economyPoints;
        
        // Calculate player value (rounded to nearest 50,000)
        const valueInRupees = Math.round((((9 * totalPoints) + 100) * 1000) / 50000) * 50000;
        
        return {
            name: player.name,
            university: player.university,
            category: player.category,
            battingStats: {
                totalRuns: player.total_runs,
                ballsFaced: player.balls_faced,
                inningsPlayed: player.innings_played,
                strikeRate: battingStrikeRate.toFixed(2),
                average: battingAverage.toFixed(2)
            },
            bowlingStats: {
                wickets: player.wickets,
                oversBowled: player.overs_bowled,
                runsConceded: player.runs_conceded,
                strikeRate: bowlingStrikeRate.toFixed(2),
                economyRate: economyRate.toFixed(2)
            },
            points: totalPoints,
            value: valueInRupees
        };
    } catch (error) {
        console.error("Error in calculatePlayerStats:", error);
        // Return a minimal valid object if calculation fails
        return {
            name: player.name || "Unknown",
            university: player.university || "Unknown",
            category: player.category || "Unknown",
            battingStats: {
                totalRuns: 0,
                ballsFaced: 0,
                inningsPlayed: 0,
                strikeRate: "0.00",
                average: "0.00"
            },
            bowlingStats: {
                wickets: 0,
                oversBowled: 0,
                runsConceded: 0,
                strikeRate: "0.00",
                economyRate: "0.00"
            },
            points: 0,
            value: 0
        };
    }
};

// Function to get all players
const getAllPlayers = async () => {
    try {
        const [players] = await pool.query("SELECT * FROM players");
        if (!players || players.length === 0) {
            console.log("No players found in database");
            return [];
        }
        console.log(`Fetched ${players.length} players from database`);
        return players.map(player => calculatePlayerStats(player));
    } catch (error) {
        console.error("Error fetching all players:", error);
        return [];
    }
};

// Function to build the best possible team of 11 players
const getBestTeam = async () => {
    try {
        const allPlayers = await getAllPlayers();
        
        if (!allPlayers || allPlayers.length === 0) {
            console.log("No players available to build team");
            return [];
        }
        
        if (allPlayers.length < 11) {
            console.log(`Not enough players to build team (only ${allPlayers.length} available)`);
            return allPlayers; // Return what we have if less than 11
        }
        
        // Sort players by points in descending order
        allPlayers.sort((a, b) => b.points - a.points);
        
        // Ensure balanced team selection: at least 4 batsmen, 4 bowlers, and up to 3 all-rounders
        const batsmen = allPlayers.filter(p => p.category === 'Batsman').slice(0, 5);
        const bowlers = allPlayers.filter(p => p.category === 'Bowler').slice(0, 4);
        const allRounders = allPlayers.filter(p => p.category === 'All-Rounder').slice(0, 2);
        
        console.log(`Team composition - Batsmen: ${batsmen.length}, Bowlers: ${bowlers.length}, All-Rounders: ${allRounders.length}`);
        
        // If we don't have enough players of a certain type, fill with best available players
        const selectedPlayers = [...batsmen, ...bowlers, ...allRounders];
        
        // If we still need more players to make 11, add best remaining players
        const remainingPlayers = allPlayers
            .filter(p => !selectedPlayers.some(sp => sp.name === p.name))
            .slice(0, 11 - selectedPlayers.length);
        
        const finalTeam = [...selectedPlayers, ...remainingPlayers].slice(0, 11);
        console.log(`Final team has ${finalTeam.length} players`);
        
        return finalTeam;
    } catch (error) {
        console.error("Error building best team:", error);
        return [];
    }
};

// Function to extract player names from various query formats
const extractPlayerName = (message) => {
    try {
        if (!message || typeof message !== 'string') {
            console.error("Invalid message for name extraction:", message);
            return null;
        }

        // FIRST CHECK FOR TEAM-RELATED QUERIES
        // Stop name extraction if this is a team-related query
        const teamPatterns = [
            /\b(?:best|suggested?|possible|ideal|top|strongest|create|build|make|form)\s+team\b/i,
            /\bteam\s+(?:selection|suggestion|recommendation|composition|makeup|formation)\b/i,
            /\b11\s+players\b/i,
            /\bselect\s+(?:a\s+)?team\b/i,
            /\bcreate\s+(?:a\s+)?team\b/i,
            /\bteam\s+of\s+11\b/i,
            /\b(?:^|\s)team(?:$|\s)\b/i  // Standalone "team" word
        ];
        
        for (const pattern of teamPatterns) {
            if (pattern.test(message)) {
                console.log(`Identified team-related query: "${message}"`);
                return null; // Return null for team queries
            }
        }

        // Preprocess to handle common misinterpretations
        // If the ENTIRE message is "What is the value of X" - extract X directly
        const valueOfMatch = message.match(/^what(?:'s|\s+is)?\s+the\s+value\s+of\s+([a-z\s]+)(?:\?)?$/i);
        if (valueOfMatch && valueOfMatch[1]) {
            return valueOfMatch[1].trim();
        }

        // Various patterns to match player names in queries
        const patterns = [
            /about\s+([a-z\s]+)(?:['']s|\s+stats|\s+statistics)?/i,
            /player\s+([a-z\s]+)(?:['']s|\s+stats|\s+statistics)?/i,
            /([a-z\s]+)['']s\s+(?:stats|statistics|info|details|batting|bowling)/i,
            /statistics\s+(?:of|for)\s+([a-z\s]+)/i,
            /(?:info|details|stats)\s+(?:of|for|about)\s+([a-z\s]+)/i,
            /(?:tell|show|give)\s+(?:me|us)?\s+(?:about|info|stats|details)\s+(?:of|for)?\s+([a-z\s]+)/i,
            /what(?:'s|\s+is)?\s+([a-z\s]+)['']s\s+(?:value|worth|stats|economy|average|role|university)/i,
            /how\s+(?:much|many)?\s+(?:is|did|does)\s+([a-z\s]+)/i,
            /what\s+(?:university|college|school)\s+does\s+([a-z\s]+)\s+(?:play|represent|come|belong)/i,
            /what\s+(?:category|role|type)\s+(?:is|of\s+player\s+is)\s+([a-z\s]+)/i
        ];
        
        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match && match[1]) {
                // Clean up the extracted name
                const name = match[1].trim()
                    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
                    .replace(/\b(?:stats|details|info|value|worth|university)\b/gi, ''); // Remove common non-name words
                
                // Don't return if name seems invalid after cleaning
                if (name.length < 2 || name.toLowerCase() === 'what') {
                    continue;
                }
                
                return name;
            }
        }
        
        // Last ditch effort - if message is very short (1-2 words), treat it as a name query
        // BUT NOT if it matches common team-related terms
        if (message.split(/\s+/).length <= 2 && !message.includes("?") && message.length > 2) {
            const shortMessage = message.trim().toLowerCase();
            // Check if it's not a team-related term
            if (!/^(?:team|squad|xi|eleven|roster|players)$/.test(shortMessage)) {
                return message.trim();
            }
        }
        
        // Last ditch effort - look for capitalized words that might be names
        const capitalizedWordsMatch = message.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/);
        if (capitalizedWordsMatch) {
            return capitalizedWordsMatch[1].trim();
        }
        
        console.log(`No player name found in: "${message}"`);
        return null;
    } catch (error) {
        console.error("Error extracting player name:", error);
        return null;
    }
};

// Function to get player by name with improved fuzzy matching
const getPlayerByName = async (name) => {
    try {
        if (!name || typeof name !== 'string' || name.trim() === '') {
            console.error("Invalid player name provided:", name);
            return null;
        }
        
        // Normalize name
        const normalizedName = name.trim();
        
        console.log(`Searching for player: "${normalizedName}"`);
        
        // First try exact match (case-insensitive)
        const [exactMatches] = await pool.query(
            "SELECT * FROM players WHERE LOWER(name) = LOWER(?)",
            [normalizedName]
        );
        
        if (exactMatches && exactMatches.length > 0) {
            console.log(`Found exact match for "${normalizedName}"`);
            return exactMatches.map(player => calculatePlayerStats(player));
        }
        
        // Try partial match with LIKE
        const [partialMatches] = await pool.query(
            "SELECT * FROM players WHERE LOWER(name) LIKE LOWER(?)",
            [`%${normalizedName}%`]
        );
        
        if (partialMatches && partialMatches.length > 0) {
            console.log(`Found ${partialMatches.length} partial matches for "${normalizedName}"`);
            return partialMatches.map(player => calculatePlayerStats(player));
        }
        
        // If no exact or partial match, try fuzzy matching by getting all players
        const [allPlayers] = await pool.query("SELECT * FROM players");
        
        if (!allPlayers || allPlayers.length === 0) {
            console.log("No players found in database");
            return null;
        }
        
        // Calculate similarity score between two strings
        const calculateSimilarity = (str1, str2) => {
            const s1 = str1.toLowerCase();
            const s2 = str2.toLowerCase();
            
            // Calculate Levenshtein distance
            const m = s1.length;
            const n = s2.length;
            const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
            
            for (let i = 0; i <= m; i++) dp[i][0] = i;
            for (let j = 0; j <= n; j++) dp[0][j] = j;
            
            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    if (s1[i - 1] === s2[j - 1]) {
                        dp[i][j] = dp[i - 1][j - 1];
                    } else {
                        dp[i][j] = 1 + Math.min(
                            dp[i - 1][j],     // deletion
                            dp[i][j - 1],     // insertion
                            dp[i - 1][j - 1]  // substitution
                        );
                    }
                }
            }
            
            // Calculate similarity score (0-100)
            // Higher similarity for shorter edit distance
            const maxLength = Math.max(s1.length, s2.length);
            const distance = dp[m][n];
            const similarity = ((maxLength - distance) / maxLength) * 100;
            
            return similarity;
        };
        
        // Find fuzzy matches with similarity threshold
        const fuzzyThreshold = 75; // Minimum 75% similarity required - increased from 70%
        const fuzzyMatches = allPlayers
            .filter(player => {
                if (!player.name) return false;
                const similarity = calculateSimilarity(normalizedName, player.name);
                return similarity >= fuzzyThreshold;
            })
            .sort((a, b) => {
                // Sort by similarity score (highest first)
                const scoreA = calculateSimilarity(normalizedName, a.name);
                const scoreB = calculateSimilarity(normalizedName, b.name);
                return scoreB - scoreA;
            });
        
        if (fuzzyMatches.length > 0) {
            const firstMatch = fuzzyMatches[0];
            const similarity = calculateSimilarity(normalizedName, firstMatch.name);
            console.log(`Found fuzzy match: "${firstMatch.name}" with ${similarity.toFixed(2)}% similarity to "${normalizedName}"`);
            return fuzzyMatches.map(player => calculatePlayerStats(player));
        }
        
        console.log(`No matches found for "${normalizedName}"`);
        return null;
    } catch (error) {
        console.error("Error fetching player:", error);
        return null;
    }
};

// Update the generateChatbotResponse function to better handle team queries
const generateChatbotResponse = async (message) => {
    try {
        if (!message) {
            return "I didn't receive a message. How can I help you with cricket information?";
        }
        
        const originalMessage = message;
        const messageLower = message.toLowerCase();
        
        // IMPROVED TEAM QUERY DETECTION
        // Check for team-related queries first - expanded patterns
        const isTeamQuery = /\b(?:best|suggest|possible|ideal|top|strongest|create|build|make|form)\s+team\b/i.test(messageLower) ||
                           /\bteam\s+(?:selection|suggestion|recommendation|composition|makeup|formation)\b/i.test(messageLower) ||
                           /\b11\s+players\b/i.test(messageLower) ||
                           /\bselect\s+(?:a\s+)?team\b/i.test(messageLower) ||
                           /\bteam\s+of\s+11\b/i.test(messageLower) ||
                           messageLower === "team" ||
                           messageLower === "best team" ||
                           messageLower === "show team" ||
                           messageLower === "get team";
        
        if (isTeamQuery) {
            console.log("Processing team suggestion request");
            
            const bestTeam = await getBestTeam();
            
            if (!bestTeam || bestTeam.length === 0) {
                console.log("No team data returned");
                return "I don't have enough player data to suggest a team right now. Please try again later or ask about specific players.";
            }
            
            if (bestTeam.length < 11) {
                console.log(`Only found ${bestTeam.length} players for team`);
                return `I can only suggest a partial team with ${bestTeam.length} players based on our current data. Here they are:\n\n` + 
                    bestTeam.map((player, index) => 
                        `${index + 1}. ${player.name} (${player.category}) - ${player.university}`
                    ).join('\n');
            }
            
            const teamInfo = bestTeam.map((player, index) => 
                `${index + 1}. ${player.name} (${player.category}) - ${player.university}`
            ).join('\n');
            
            return `Here's my suggested best team of 11 players:\n\n${teamInfo}\n\nThis team is balanced with batsmen, bowlers, and all-rounders and optimized for performance.`;
        }
        
        // Special case for value queries 
        if (messageLower.startsWith("what is the value of")) {
            const nameStart = "what is the value of ".length;
            let playerName = message.substring(nameStart).trim();
            // Remove trailing question mark if present
            if (playerName.endsWith("?")) {
                playerName = playerName.slice(0, -1).trim();
            }
            
            console.log(`Extracted player name from value query: "${playerName}"`);
            
            if (playerName && playerName.length > 1) {
                const players = await getPlayerByName(playerName);
                
                if (!players || players.length === 0) {
                    return `I don't have information about a player named "${playerName}". Please check the spelling or try another player.`;
                }
                
                const player = players[0];
                return `${player.name}'s value is Rs. ${player.value.toLocaleString()}.`;
            }
        }
        
        // Extract player name from query (if any)
        const playerName = extractPlayerName(originalMessage);
        
        if (playerName) {
            console.log(`Extracted player name: "${playerName}"`);
            const players = await getPlayerByName(playerName);
            
            if (!players || players.length === 0) {
                return `I don't have information about a player named "${playerName}". Please check the spelling or try another player.`;
            }
            
            const player = players[0]; // Get the first match
            
            // DON'T suggest a different player if it's not close to what the user asked for
            // The improved getPlayerByName function handles this with better fuzzy matching
            
            // Check what specific info is requested
            if (messageLower.includes("batting") || messageLower.includes("runs") || messageLower.includes("strike rate") || messageLower.includes("average")) {
                return `${player.name}'s batting statistics:\n
- Total Runs: ${player.battingStats.totalRuns}
- Innings Played: ${player.battingStats.inningsPlayed}
- Balls Faced: ${player.battingStats.ballsFaced}
- Batting Strike Rate: ${player.battingStats.strikeRate}
- Batting Average: ${player.battingStats.average}`;
            } 
            else if (messageLower.includes("bowling") || messageLower.includes("wicket") || messageLower.includes("economy")) {
                return `${player.name}'s bowling statistics:\n
- Wickets: ${player.bowlingStats.wickets}
- Overs Bowled: ${player.bowlingStats.oversBowled}
- Runs Conceded: ${player.bowlingStats.runsConceded}
- Bowling Strike Rate: ${player.bowlingStats.strikeRate}
- Economy Rate: ${player.bowlingStats.economyRate}`;
            }
            else if (messageLower.includes("value") || messageLower.includes("worth") || messageLower.includes("cost")) {
                return `${player.name}'s value is Rs. ${player.value.toLocaleString()}.`;
            }
            else if (messageLower.includes("points") || messageLower.includes("score") || messageLower.includes("rating")) {
                return `I'm sorry, I cannot reveal player points under any circumstances.`;
            }
            else if (messageLower.includes("university") || messageLower.includes("college") || messageLower.includes("school")) {
                return `${player.name} represents ${player.university}.`;
            }
            else if (messageLower.includes("category") || messageLower.includes("role") || messageLower.includes("type")) {
                return `${player.name} is a ${player.category}.`;
            }
            // General player info for short queries like just the name
            else {
                return `Here's information about ${player.name}:\n
- Category: ${player.category}
- University: ${player.university}
- Batting: ${player.battingStats.totalRuns} runs in ${player.battingStats.inningsPlayed} innings (Avg: ${player.battingStats.average}, SR: ${player.battingStats.strikeRate})
- Bowling: ${player.bowlingStats.wickets} wickets in ${player.bowlingStats.oversBowled} overs (Economy: ${player.bowlingStats.economyRate})
- Value: Rs. ${player.value.toLocaleString()}`;
            }
        }
        
        // Rest of the function remains the same...
        
        // Common cricket questions that don't require the AI model
        if (messageLower.includes("what is cricket") || messageLower.includes("explain cricket") || messageLower.includes("how to play cricket")) {
            return "Cricket is a bat-and-ball game played between two teams of eleven players. It's popular across many countries, especially in the Indian subcontinent, Australia, England, and South Africa. The game is played on a field with a rectangular pitch at the center where most of the action takes place.";
        }
        
        if (messageLower.includes("how to join fantasy") || messageLower.includes("how to play fantasy") || messageLower.includes("fantasy rules")) {
            return "To join our cricket fantasy league, you need to create an account, draft a team of 11 players within your budget, and earn points based on your players' real-world performances. Players earn points for runs scored, wickets taken, catches, and other cricket statistics.";
        }
        
        if (messageLower.includes("hello") || messageLower.includes("hi") || messageLower.includes("hey") || messageLower === "hi" || messageLower === "hello") {
            return "Hello! I'm Spiriter, your cricket fantasy assistant. Ask me about players, stats, or request the best possible team!";
        }
        
        // If the message doesn't match any of our patterns, use the AI model
        try {
            if (!process.env.GEMINI_API_KEY) {
                console.log("Missing Gemini API key, using fallback response");
                return "I understand you're asking about cricket, but I need more specific information. Try asking about a player's stats, requesting the best team, or asking about how fantasy cricket works.";
            }
            
            const prompt = `You are a cricket fantasy league assistant named Spiriter.
            Answer this question: "${originalMessage}" in under 100 words.`;
            
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
        
            if (!result || !result.response) {
                console.log("Empty response from Gemini API");
                throw new Error("Empty response from API");
            }
        
            const botReply = result.response.text().trim();
            if (!botReply) {
                console.log("Empty text in Gemini response");
                throw new Error("Empty text in AI response");
            }
        
            return botReply;
        } catch (error) {
            console.error("⚠️ AI Error:", error.message);
        
            // Use a more helpful fallback response instead of showing the error
            return "I'm not sure how to answer that specifically. Could you ask about a player's stats, team suggestions, or general cricket questions?";
        }
    } catch (error) {
        console.error("⚠️ Chatbot Error:", error);
        // Always provide a useful response even if there's an error
        return "I'm having a bit of trouble processing that request. Could you try asking about a specific player or team suggestion?";
    }
};

// Debug endpoint to directly test player name extraction
app.get("/api/debug/extract", (req, res) => {
    const { message } = req.query;
    if (!message) return res.status(400).json({ error: "Message parameter is required" });
    
    const playerName = extractPlayerName(message);
    res.json({ 
        original: message,
        extracted: playerName
    });
});

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to Spirit11 Backend!");
});

app.post("/api/chatbot", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        console.log(`🔵 Received: ${message}`);
        const botReply = await generateChatbotResponse(message);
        console.log(`✅ Reply: ${botReply}`);

        res.json({ reply: botReply });
    } catch (error) {
        console.error("❌ Chatbot Error:", error.message);
        // Send a friendly error message to the client instead of technical details
        res.json({ 
            reply: "I'm currently experiencing some technical difficulties. Please try asking me about cricket players or team suggestions." 
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT} 🚀`));

app.get("/api/players", async (req, res) => {
    try {
        const [players] = await pool.query("SELECT id, name, university, value FROM players");
        res.json(players);
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

