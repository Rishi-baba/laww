from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# Request Schema
class CaseInput(BaseModel):
    query: str = Field(..., description="Details/brief of the criminal or commercial case to analyze")

    model_config = {
        "json_schema_extra": {
            "example": {
                "query": "The accused was involved in a high-profile attempt to murder incident. Witness statements confirm presence, cellular triangulation matches geofenced coordinates."
            }
        }
    }

# Response Component Schemas
class SimilarCase(BaseModel):
    case_title: str
    case_type: str
    sub_category: str
    legal_sections: str
    judgment_outcome: str
    judge_observation: str
    similarity_score: float
    case_text: str

class PredictedSection(BaseModel):
    section: str
    confidence: float

class EvidenceMapping(BaseModel):
    evidence: str
    laws: List[str]

class MissingEvidence(BaseModel):
    evidence: str

class OutcomeAnalytic(BaseModel):
    outcome: str
    percentage: float

class ReliefAnalytic(BaseModel):
    relief: str
    percentage: float

class JudgmentAnalytics(BaseModel):
    case_type: str
    outcome_analytics: List[OutcomeAnalytic]
    relief_analytics: List[ReliefAnalytic]

# Master Response Schema
class AnalyzeCaseResponse(BaseModel):
    predicted_sections: List[PredictedSection] = Field(..., description="IPC predicted statutes and sections")
    legal_sections: List[PredictedSection] = Field(..., description="Alias key for predicted_sections (backwards compatibility)")
    similar_cases: List[SimilarCase] = Field(..., description="COSINE score semantic matches retrieving trial precedents")
    evidence_mapping: List[EvidenceMapping] = Field(..., description="Corroboration topology map representing connections")
    missing_evidence: List[MissingEvidence] = Field(..., description="Critical audit logs representing evidentiary gaps")
    analytics: Optional[JudgmentAnalytics] = Field(None, description="Cosines and historic court verdict pattern ratios")

    model_config = {
        "json_schema_extra": {
            "example": {
                "predicted_sections": [
                    {"section": "IPC Section 307 - Attempt to Murder", "confidence": 75.5}
                ],
                "legal_sections": [
                    {"section": "IPC Section 307 - Attempt to Murder", "confidence": 75.5}
                ],
                "similar_cases": [
                    {
                        "case_title": "State of Maharashtra v. Vikram R. Singhania",
                        "case_type": "Criminal Appeal",
                        "sub_category": "Homicide",
                        "legal_sections": "IPC Section 307",
                        "judgment_outcome": "Conviction Upheld",
                        "judge_observation": "Geofencing evidence overrides witness retraction.",
                        "similarity_score": 91.0,
                        "case_text": "Full case briefing text..."
                    }
                ],
                "evidence_mapping": [
                    {"evidence": "Cellular Triangulation", "laws": ["IPC Section 307"]}
                ],
                "missing_evidence": [
                    {"evidence": "Weapon Recovery Report"}
                ],
                "analytics": {
                    "case_type": "Criminal Appeal",
                    "outcome_analytics": [{"outcome": "Conviction Upheld", "percentage": 85.0}],
                    "relief_analytics": [{"relief": "Bail Denied", "percentage": 90.0}]
                }
            }
        }
    }

# Health Check Schema
class HealthCheckResponse(BaseModel):
    status: str = "ok"
