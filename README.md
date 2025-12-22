# Railway Video Surveillance System

## How to Run

### Backend

1.  Navigate to the project root directory.
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    venv\Scripts\activate  # On Windows
    # source venv/bin/activate  # On macOS/Linux
    ```
3.  Install backend dependencies:
    ```bash
    pip install -r backend/requirements.txt
    ```
4.  Run the server using uvicorn:
    ```bash
    uvicorn backend.server:app --reload --host 0.0.0.0 --port 8000
    ```
    The backend API will start at `http://0.0.0.0:8000`.
    
    > **Note**: Database connection will default to Mock Mode if MongoDB is not available locally.

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or the port shown in the terminal).

## Testing

To run the API tests:
```bash
python backend_test.py
```
*Note: Ensure the backend server is running locally on port 8000, or update the `base_url` in `backend_test.py`.*
