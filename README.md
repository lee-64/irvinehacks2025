### Setting up the front-end
```
cd frontend

npm install

npm run dev
```


### Setting up the back-end
_(in a new terminal)_
```
cd backend

# create a virtual environment
python3.12 -m venv .venv

# install requirements
pip install -r requirements.txt

# create a file called .env in backend/ with the following API keys: 
WALK_SCORE_API_KEY=...
GROQ_API_KEY=...

cd app

uvicorn app:app --reload
```
