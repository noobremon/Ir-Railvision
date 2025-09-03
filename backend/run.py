#!/usr/bin/env python3
"""
Railway Video Surveillance System - Startup Script
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    print(f"🚂 Starting Railway Video Surveillance System on {host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    
    uvicorn.run(
        "server:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )