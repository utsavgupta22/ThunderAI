import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chats.js'
import { protect } from './middleware/auth.js'
import { handleAIChat } from './services/aiProviders.js'

// Load environment variables
dotenv.config()

console.log(`📋 Environment loaded:`);
console.log(`   PORT: ${process.env.PORT || 5000}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✓ (set)' : '✗ (NOT SET - CRITICAL!)'}`);
console.log(`   GOOGLE_API_ENDPOINT_OVERRIDE: ${process.env.GOOGLE_API_ENDPOINT_OVERRIDE || '(not set)'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB - AWAIT THIS!
await connectDB()

// API Configuration
// Use this for free tier from: https://makersuite.google.com/app/apikey
const API_KEY_SOURCE = process.env.API_KEY_SOURCE || 'makersuite' // 'makersuite' or 'cloud'

// Middleware - CORS Configuration (Allow all domains)
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Set to false when using origin: '*'
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Health Check Route (doesn't require MongoDB)
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() })
})

// Authentication Routes
app.use('/api/auth', authRoutes)

// Chat History Routes
app.use('/api/chats', chatRoutes)

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.rb', '.php', '.html', '.css', '.json', '.yaml', '.yml', '.xml', '.md', '.txt']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExts.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error(`File type ${ext} not allowed`))
    }
  }
})

// Store uploaded files in memory for this session
const uploadedFilesMap = new Map()

// Upload endpoint handler
const uploadHandler = (req, res) => {
  try {
    const files = req.files.map(file => {
      const content = fs.readFileSync(file.path, 'utf-8')
      uploadedFilesMap.set(file.filename, {
        originalName: file.originalname,
        content,
        path: file.path
      })
      return file.filename
    })

    res.json({ files })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message })
  }
}

app.post('/upload', upload.array('files', 50), uploadHandler)
app.post('/api/upload', upload.array('files', 50), uploadHandler)

// Chat endpoint - now with multi-AI support
// If user is logged in, use their API keys from profile
// If not logged in, require API key in request body
app.post('/chat', async (req, res) => {
  try {
    let { message, apiKey, uploadedFiles, provider = 'gemini', conversationHistory = [] } = req.body
    
    // Check if user is authenticated (optional)
    const authHeader = req.headers.authorization;
    let userId = null;
    let user = null;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const token = authHeader.split(' ')[1];
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
        const User = (await import('./models/User.js')).default;
        user = await User.findById(decoded.id);
        
        if (user) {
          userId = user._id;
          
          // Use user's stored API key for the selected provider if available
          if (!apiKey) {
            switch(provider) {
              case 'gemini':
                apiKey = user.geminiApiKey;
                break;
              case 'chatgpt':
                apiKey = user.openaiApiKey;
                break;
              case 'claude':
                apiKey = user.claudeApiKey;
                break;
              case 'perplexity':
                apiKey = user.perplexityApiKey;
                break;
            }
            if (apiKey) {
              console.log(`📨 Using stored ${provider} API key from user profile`);
            }
          }
        }
      } catch (authError) {
        console.log('⚠️  Token verification failed, continuing without auth:', authError.message);
      }
    }

    console.log('📨 Chat request received:', { 
      hasMessage: !!message, 
      hasApiKey: !!apiKey,
      provider,
      isAuthenticated: !!userId,
      fileCount: uploadedFiles?.length || 0 
    })

    if (!apiKey) {
      console.error('❌ No API key provided')
      return res.status(400).json({ error: `API key is required for ${provider}. Please add your API key in Settings or log in.` })
    }

    if (!message || !message.trim()) {
      console.error('❌ No message provided')
      return res.status(400).json({ error: 'Message cannot be empty' })
    }

    // Set response headers for streaming
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Build context from uploaded files
    let context = ''
    if (uploadedFiles && uploadedFiles.length > 0) {
      console.log(`📁 Building context from ${uploadedFiles.length} files...`)
      context = 'You are an AI code assistant. The user has uploaded the following code files for analysis:\n\n'
      uploadedFiles.forEach(fileName => {
        if (uploadedFilesMap.has(fileName)) {
          const fileData = uploadedFilesMap.get(fileName)
          const contentPreview = fileData.content.length > 10000 
            ? fileData.content.substring(0, 10000) + '\n... (file truncated for length)'
            : fileData.content
          context += `\n--- File: ${fileData.originalName} ---\n${contentPreview}\n`
        }
      })
      context += '\n\nPlease analyze the code and answer the following question:\n'
    } else {
      context = 'You are a helpful AI assistant. Please help with the following:\n\n'
    }

    console.log(`💬 Sending prompt to ${provider.toUpperCase()}...`)

    try {
      // Use the unified AI handler
      const result = await handleAIChat(provider, apiKey, message, context, conversationHistory)
      
      if (result.success) {
        console.log(`✅ ${provider.toUpperCase()} response received`)
        res.write(result.text)
        console.log('✅ Response sent to client')
        res.end()
      } else {
        console.error(`❌ ${provider.toUpperCase()} error:`, result.error)
        res.write(`❌ Error from ${provider}: ${result.error}\n\nTroubleshooting:\n1. Check your API key is correct\n2. Verify the API is enabled\n3. Check you have sufficient API quota\n4. Try again in a moment`)
        res.end()
      }
    } catch (aiError) {
      console.error(`❌ ${provider.toUpperCase()} error:`, aiError.message)
      res.write(`❌ Error: ${aiError.message}\n\nTroubleshooting:\n1. Check your API key is correct\n2. Verify the API is enabled\n3. Check you have sufficient API quota\n4. Try again in a moment`)
      res.end()
    }
  } catch (error) {
    console.error('❌ Chat error:', error.message)
    console.error('Full error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: error.message })
    }
  }
})

// Alias /api/chat to /chat for consistent API naming
app.post('/api/chat', async (req, res) => {
  try {
    let { message, apiKey, uploadedFiles, provider = 'gemini', conversationHistory = [] } = req.body
    
    // Check if user is authenticated (optional)
    const authHeader = req.headers.authorization;
    let userId = null;
    let user = null;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const token = authHeader.split(' ')[1];
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
        const User = (await import('./models/User.js')).default;
        user = await User.findById(decoded.id);
        
        if (user) {
          userId = user._id;
          
          // Use user's stored API key for the selected provider if available
          if (!apiKey) {
            switch(provider) {
              case 'gemini':
                apiKey = user.geminiApiKey;
                break;
              case 'chatgpt':
                apiKey = user.openaiApiKey;
                break;
              case 'claude':
                apiKey = user.claudeApiKey;
                break;
              case 'perplexity':
                apiKey = user.perplexityApiKey;
                break;
            }
            if (apiKey) {
              console.log(`📨 Using stored ${provider} API key from user profile`);
            }
          }
        }
      } catch (authError) {
        console.log('⚠️  Token verification failed, continuing without auth:', authError.message);
      }
    }

    console.log('📨 Chat request received:', { 
      hasMessage: !!message, 
      hasApiKey: !!apiKey,
      provider,
      isAuthenticated: !!userId,
      fileCount: uploadedFiles?.length || 0 
    })

    if (!apiKey) {
      console.error('❌ No API key provided')
      return res.status(400).json({ error: `API key is required for ${provider}. Please add your API key in Settings or log in.` })
    }

    if (!message || !message.trim()) {
      console.error('❌ No message provided')
      return res.status(400).json({ error: 'Message cannot be empty' })
    }

    // Set response headers for streaming
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Helper function to send progress updates
    const sendProgress = (stage, details) => {
      res.write(`data: ${JSON.stringify({ type: 'progress', stage, details })}\n\n`);
    };

    // Build context from uploaded files
    let context = ''
    let includeFileContext = false
    
    // Only include file context if:
    // 1. Files are uploaded AND
    // 2. This is the first message OR user explicitly mentions files/code in their message
    if (uploadedFiles && uploadedFiles.length > 0) {
      const isFirstMessage = !conversationHistory || conversationHistory.length === 0
      const mentionsFiles = message.toLowerCase().match(/\b(file|code|analyze|review|check|look at|examine)\b/)
      
      includeFileContext = isFirstMessage || mentionsFiles
      
      if (includeFileContext) {
        console.log(`📁 Building context from ${uploadedFiles.length} files...`)
        sendProgress('analyzing', `Analyzing ${uploadedFiles.length} uploaded file(s)...`);
        
        context = 'You are an AI code assistant. The user has uploaded the following code files for analysis:\n\n'
        
        // Process each file with detailed progress
        let fileIndex = 0;
        uploadedFiles.forEach(fileName => {
          if (uploadedFilesMap.has(fileName)) {
            fileIndex++;
            sendProgress('scanning', `Scanning file ${fileIndex}/${uploadedFiles.length}: ${fileName}`);
            
            const fileData = uploadedFilesMap.get(fileName)
            const contentPreview = fileData.content.length > 10000 
              ? fileData.content.substring(0, 10000) + '\n... (file truncated for length)'
              : fileData.content
            context += `\n--- File: ${fileData.originalName} ---\n${contentPreview}\n`
            
            sendProgress('reading', `Reading ${fileData.originalName} (${fileData.content.length} characters)`);
          }
        })
        
        context += '\n\nPlease analyze the code and answer the following question:\n'
        sendProgress('understanding', `Understanding ${uploadedFiles.length} file(s) context...`);
        sendProgress('searching', `Found relevant code in ${uploadedFiles.length} file(s)`);
      } else {
        console.log('⏭️  Skipping file context - user asking general question')
        context = 'You are a helpful AI assistant. Please help with the following:\n\n'
      }
    } else {
      context = 'You are a helpful AI assistant. Please help with the following:\n\n'
    }

    sendProgress('thinking', `AI is analyzing your request...`);
    sendProgress('processing', `Sending request to ${provider.toUpperCase()}...`);
    console.log(`💬 Sending prompt to ${provider.toUpperCase()}...`)

    try {
      sendProgress('generating', `Waiting for ${provider.toUpperCase()} to respond...`);
      
      // Limit conversation history to last 10 messages to prevent context overload
      // and reduce AI's tendency to repeat old file analysis
      const recentHistory = conversationHistory.slice(-10);
      
      sendProgress('streaming', `Receiving response from ${provider.toUpperCase()}...`);
      
      // Use the unified AI handler
      const result = await handleAIChat(provider, apiKey, message, context, recentHistory)
      
      if (result.success) {
        console.log(`✅ ${provider.toUpperCase()} response received`)
        // Send completion signal
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        
        // Stream the response word by word for ChatGPT-like effect
        const words = result.text.split(' ');
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i < words.length - 1 ? ' ' : '');
          res.write(word);
          // Small delay between words for streaming effect (adjust as needed)
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        console.log('✅ Response sent to client')
        res.end()
      } else {
        console.error(`❌ ${provider.toUpperCase()} error:`, result.error)
        res.write(`data: ${JSON.stringify({ type: 'error' })}\n\n`);
        res.write(`❌ Error from ${provider}: ${result.error}\n\nTroubleshooting:\n1. Check your API key is correct\n2. Verify the API is enabled\n3. Check you have sufficient API quota\n4. Try again in a moment`)
        res.end()
      }
    } catch (aiError) {
      console.error(`❌ ${provider.toUpperCase()} error:`, aiError.message)
      res.write(`data: ${JSON.stringify({ type: 'error' })}\n\n`);
      res.write(`❌ Error: ${aiError.message}\n\nTroubleshooting:\n1. Check your API key is correct\n2. Verify the API is enabled\n3. Check you have sufficient API quota\n4. Try again in a moment`)
      res.end()
    }
  } catch (error) {
    console.error('❌ Chat error:', error.message)
    console.error('Full error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: error.message })
    }
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

// Test API key endpoint
app.post('/test-api-key', async (req, res) => {
  const { apiKey, provider = 'gemini' } = req.body

  if (!apiKey) {
    return res.status(400).json({ error: 'API key required' })
  }

  try {
    console.log(`🧪 Testing ${provider} API key...`)
    
    const result = await handleAIChat(provider, apiKey, 'Hello', '')
    
    if (result.success) {
      return res.json({ 
        success: true,
        message: `✅ ${provider} API key is valid!`,
        sample: result.text.substring(0, 100)
      })
    } else {
      return res.status(400).json({ 
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('API key test error:', error.message)
    res.status(400).json({ 
      error: error.message || 'Failed to test API key'
    })
  }
})

// Diagnostic endpoint to test which models actually work for content generation
app.post('/diagnose-models', async (req, res) => {
  const { apiKey } = req.body

  if (!apiKey) {
    return res.status(400).json({ error: 'API key required' })
  }

  try {
    const providers = ['gemini', 'chatgpt', 'claude', 'perplexity'];
    const results = {};
    
    for (const provider of providers) {
      try {
        console.log(`Testing provider: ${provider}`);
        const result = await handleAIChat(provider, apiKey, 'Hi', '');
        
        if (result.success) {
          results[provider] = { status: 'SUCCESS', sample: result.text.substring(0, 50) };
          console.log(`✅ ${provider} works!`);
        } else {
          results[provider] = { status: 'FAILED', error: result.error };
          console.log(`❌ ${provider} failed: ${result.error}`);
        }
      } catch (e) {
        results[provider] = { status: 'ERROR', error: e.message };
        console.log(`❌ ${provider} error: ${e.message}`);
      }
    }
    
    res.json({ results, apiKey: apiKey.substring(0, 10) + '...' });
  } catch (error) {
    console.error('Diagnostic error:', error.message);
    res.status(500).json({ error: error.message });
  }
})

// Cleanup uploaded files on server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  
  // Clean up old uploads
  const uploadsDir = './uploads'
  if (fs.existsSync(uploadsDir)) {
    fs.readdirSync(uploadsDir).forEach(file => {
      fs.unlinkSync(path.join(uploadsDir, file))
    })
  }
})
