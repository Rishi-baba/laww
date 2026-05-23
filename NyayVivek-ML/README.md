<div align="center">

# ⚖️ NyayVivek AI

### AI-Powered Legal Intelligence & Semantic Case Analysis System

<img src="https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python"/>
<img src="https://img.shields.io/badge/Flask-Backend-black?style=for-the-badge&logo=flask"/>
<img src="https://img.shields.io/badge/FAISS-Semantic_Search-orange?style=for-the-badge"/>
<img src="https://img.shields.io/badge/SentenceTransformers-NLP-red?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Status-MVP-success?style=for-the-badge"/>

---

### 🚀 AI-assisted legal analysis using semantic retrieval, IPC prediction, evidence analytics, and explainable legal intelligence.

</div>

---

# ✨ Features

| Feature | Description |
|---|---|
| 🔍 Similar Case Retrieval | Finds semantically similar historical cases |
| ⚖️ IPC Prediction | Predicts relevant legal sections |
| 🧠 Missing Evidence Detection | Detects commonly missing evidence |
| 📊 Judgment Analytics | Shows historical outcome patterns |
| 🔗 Evidence-Law Mapping | Explains relationship between evidence and laws |

---

# 🏗️ System Architecture

```text
Frontend / User Query
        ↓
Flask API (app.py)
        ↓
ML Engine (ml_engine.py)
        ↓
SentenceTransformer Embeddings
        ↓
FAISS Semantic Retrieval
        ↓
Legal Intelligence Pipeline
        ├── Similar Cases
        ├── IPC Prediction
        ├── Missing Evidence Detection
        ├── Judgment Analytics
        └── Evidence-Law Mapping
        ↓
Structured JSON Response
```

---

# 🧠 Tech Stack

## Backend
- Flask
- Flask-CORS

## Machine Learning / NLP
- SentenceTransformers
- FAISS
- scikit-learn
- pandas
- numpy

---

# 📂 Project Structure

```bash
NyayVivek-ML/
│
├── app.py
├── ml_engine.py
├── test_ml.py
├── new.ipynb
├── requirements.txt
├── README.md
├── temp1.xlsx
├── faiss_index.pkl
├── legal_dataset.pkl
```

---

# ⚙️ Installation

```bash
git clone https://github.com/iisha-git/NyayVivek-ML.git

cd NyayVivek-ML

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

---

# 🚀 Run Backend

```bash
python app.py
```

Backend runs on:

```text
http://127.0.0.1:5000
```

---

# 📡 API Endpoint

## POST `/analyze`

### Request

```json
{
  "query": "The accused was involved in a murder case..."
}
```

---

### Response

```json
{
  "similar_cases": [],
  "predicted_sections": [],
  "missing_evidence": [],
  "judgment_analytics": [],
  "evidence_law_mapping": []
}
```

---

# 🌟 Current Capabilities

✅ Semantic Legal Search  
✅ Explainable AI Layer  
✅ IPC Prediction  
✅ Evidence Intelligence  
✅ Backend API Integration  
✅ Frontend-ready JSON Responses  

---

# 🔮 Future Improvements

- PDF Upload Support
- OCR for Scanned Judgments
- FastAPI Migration
- Authentication System
- AI Legal Chat Assistant
- Cloud Deployment
- Real-time Dashboard

---

<div align="center">

## ⚖️ Built with AI + Legal Intelligence

### NyayVivek Team

</div>