# 🚗 Vehicle Insurance Response Prediction — End-to-End MLOps

### A production-style machine learning system that predicts customer response to a vehicle insurance offer — from raw data in MongoDB Atlas to a live, auto-deploying application on AWS.

## 📌 Overview

This project simulates a real production ML system for an insurance company: predicting whether a customer will respond positively to a vehicle insurance offer, based on demographic, vehicle, and policy data.

It's built the way a production ML system actually gets built — not a single notebook, but a **modular, config-driven pipeline** with clear separation between data access, validation, transformation, training, evaluation, and deployment, wired together with a full CI/CD pipeline that deploys automatically on every push.

**Live demo:** (http://54.242.118.38:5000/)

---

## 🏗️ Architecture

```
MongoDB Atlas ──▶ Data Ingestion ──▶ Data Validation ──▶ Data Transformation
                                                                    │
                                                                    ▼
   AWS S3 (Model Registry) ◀── Model Pusher ◀── Model Evaluation ◀── Model Trainer
            │
            ▼
   FastAPI Serving App ──▶ Docker Container ──▶ AWS EC2 (via ECR)
            ▲
            │
   GitHub Actions CI/CD (build → push to ECR → deploy via self-hosted runner)
```

Each stage produces a versioned **artifact** that feeds the next — mirroring how real ML pipelines separate concerns so any single stage can be modified, retrained, or debugged independently.

---

## ⚙️ Tech Stack & Services

| Layer | Tools / Services | Purpose |
|---|---|---|
| **Data Source** | MongoDB Atlas | Cloud-hosted NoSQL database, simulating a live production data source (381K+ records) |
| **Language** | Python 3.10 | Core implementation language |
| **Data Handling** | Pandas, NumPy | Data manipulation and transformation |
| **Modeling** | scikit-learn (Random Forest) | Classification model for response prediction |
| **Imbalanced Data** | imbalanced-learn | Handling class imbalance in the target variable |
| **Visualization** | Matplotlib, Seaborn, Plotly | EDA and evaluation reporting |
| **Config Management** | YAML (`schema.yaml`, `model.yaml`) | Schema validation and hyperparameter configuration, decoupled from code |
| **Backend / Serving** | FastAPI, Uvicorn, Jinja2 | REST API and server-rendered prediction interface |
| **Model Registry** | AWS S3 | Versioned storage for trained models, decoupled from the serving application |
| **Containerization** | Docker | Reproducible runtime environment across dev and production |
| **Container Registry** | AWS ECR | Storage and versioning for built Docker images |
| **Compute** | AWS EC2 | Hosts the live, running application |
| **CI/CD** | GitHub Actions (self-hosted runner) | Automated build → push → deploy pipeline on every commit to `main` |
| **Secrets Management** | GitHub Actions Secrets, Environment Variables | Credentials never hardcoded in source |

---

## 🔩 Pipeline Stages

**1. Data Ingestion**
Connects to MongoDB Atlas, pulls the full collection into a DataFrame, and splits it into train/test sets, saved as versioned artifacts.

**2. Data Validation**
Validates incoming data against a defined `schema.yaml` — column names, types, and structure — so malformed or drifted data is caught before it reaches training.

**3. Data Transformation**
Encodes categorical features, scales numerical features, and handles class imbalance. The fitted transformer is saved as an artifact and reused identically at inference time to prevent training-serving skew.

**4. Model Training**
Trains a Random Forest classifier using hyperparameters defined externally in `model.yaml` — fully config-driven, no hardcoded values.

**5. Model Evaluation**
Compares the newly trained model against the currently deployed baseline. A new model is only promoted if it exceeds a defined performance improvement threshold — implementing a simple **model governance** pattern rather than blind overwrites.

**6. Model Pusher**
Pushes the approved model to an AWS S3 bucket, acting as a lightweight model registry, decoupled from the serving application's deployment lifecycle.

**7. Prediction Service**
A FastAPI application serves a styled, server-rendered form; on submission, it pulls the current approved model from S3, applies the saved preprocessing pipeline, and returns a real-time prediction.

---

## 🔁 CI/CD Pipeline

Every push to `main` triggers a fully automated three-stage GitHub Actions workflow:

1. **Continuous Integration** — checks out code, runs lint/tests on a GitHub-hosted runner
2. **Continuous Delivery** — builds the Docker image and pushes it to AWS ECR
3. **Continuous Deployment** — a **self-hosted runner on the EC2 instance itself** pulls the new image and restarts the live container, with zero manual intervention

This mirrors real-world deployment patterns: build/test on ephemeral infrastructure, deploy through infrastructure that has direct access to production.

---

## 📁 Project Structure

```
Vehicle-Insurance-Project-MLOPs1/
├── .github/workflows/       # CI/CD pipeline definition
├── config/                  # schema.yaml, model.yaml
├── src/
│   ├── cloud_storage/       # AWS S3 integration
│   ├── components/          # Ingestion, validation, transformation, training, evaluation, pusher
│   ├── configuration/       # MongoDB & AWS client setup
│   ├── constants/           # Centralized config values
│   ├── data_access/         # MongoDB data access layer
│   ├── entity/               # Config & artifact schemas
│   ├── exception/            # Custom exception handling
│   ├── logger/                # Structured logging
│   ├── pipeline/              # Training & prediction pipeline orchestration
│   └── utils/
├── static/                   # CSS for the web interface
├── templates/                 # Jinja2 HTML templates
├── app.py                     # FastAPI application entry point
├── demo.py                    # Standalone training pipeline runner
├── Dockerfile
└── requirements.txt
```

---

## 🚀 Running Locally

```bash
git clone https://github.com/<your-username>/Vehicle-Insurance-Project-MLOPs1.git
cd Vehicle-Insurance-Project-MLOPs1

python -m venv venv
venv\Scripts\Activate.ps1        # Windows PowerShell

pip install -r requirements.txt

# Set required environment variables
$env:MONGODB_URL="your_mongodb_connection_string"
$env:AWS_ACCESS_KEY_ID="your_key"
$env:AWS_SECRET_ACCESS_KEY="your_secret"
$env:AWS_DEFAULT_REGION="your_region"

python app.py
```
Visit `http://localhost:5000`

**Retrain the model:**
```bash
python demo.py
```
or hit the `/train` endpoint directly.

---

## 🔐 Production Practices Implemented

- ✅ No hardcoded credentials — all secrets via environment variables / GitHub Actions Secrets
- ✅ Config-driven pipeline (YAML-based schema and hyperparameters)
- ✅ Structured logging and custom exception handling across every module
- ✅ Model governance — new models only promoted if they outperform the baseline
- ✅ Fully automated CI/CD with self-hosted deployment
- ✅ Decoupled model registry (S3) from application deployment

---

## 📈 Future Improvements

-  Add DVC for full data/model version control
-  Integrate MLflow for experiment tracking
-  Add automated unit tests to the CI pipeline
-  Add monitoring for model/data drift in production
-  Migrate frontend to a dedicated single-page application

---

## 👤 Author

**Mubashir**
BS Artificial Intelligence, HiTech University
Focused on ML Engineering & MLOps | Building production-grade ML systems

[LinkedIn](#) · [GitHub](#) · [Portfolio](#)

</div>
