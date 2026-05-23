import pandas as pd
import numpy as np
import faiss
import re

from collections import Counter, defaultdict

from sentence_transformers import SentenceTransformer


# =========================
# LOAD DATASET
# =========================

df = pd.read_excel("temp1.xlsx")


# =========================
# TEXT CLEANING
# =========================

def clean_text(text):

    text = str(text).lower()

    text = re.sub(r'\n', ' ', text)

    text = re.sub(
        r'[^a-zA-Z0-9 ]',
        '',
        text
    )

    text = re.sub(r'\s+', ' ', text)

    return text


# =========================
# CREATE COMBINED TEXT
# =========================

df['combined_text'] = (

    df['case_text'].fillna('') + ' ' +

    df['legal_sections'].fillna('') + ' ' +

    df['judge_observation'].fillna('') + ' ' +

    df['legal_keywords'].fillna('') + ' ' +

    df['sub_category'].fillna('')

)

df['combined_text'] = df[
    'combined_text'
].apply(clean_text)


# =========================
# LOAD MODEL
# =========================

model = SentenceTransformer(
    'all-MiniLM-L6-v2'
)


# =========================
# LOAD SAVED EMBEDDINGS
# =========================

embeddings = np.load(
    "case_embeddings.npy"
)


# =========================
# LOAD SAVED FAISS INDEX
# =========================

index = faiss.read_index(
    "legal_cases.index"
)


# =========================
# NORMALIZE LAW
# =========================

def normalize_law(law):

    law = str(law).upper().strip()

    # Remove unnecessary words
    law = law.replace(
        "SECTION",
        ""
    )

    law = law.replace(
        "SECTIONS",
        ""
    )

    law = law.replace(
        "AND RELATED PROVISIONS",
        ""
    )

    # Fix IPC formatting
    law = law.replace(
        "IPC S",
        "IPC"
    )

    law = law.replace(
        "IPC SECTION",
        "IPC"
    )

    # Normalize spaces
    law = re.sub(
        r'\s+',
        ' ',
        law
    )

    # Remove extra spaces
    law = law.strip()

    return law


# =========================
# DOMINANT CASE TYPE
# =========================

def get_dominant_case_type(I):

    retrieved_types = []

    for idx in I[0]:

        case_type = df.iloc[idx]["case_type"]

        retrieved_types.append(case_type)

    dominant = Counter(
        retrieved_types
    ).most_common(1)[0][0]

    return dominant


# =========================
# SMART RETRIEVAL
# =========================

def smart_retrieval(query, top_k=5):

    # Encode query
    query_embedding = model.encode([query])

    # Search saved FAISS
    D, I = index.search(
        np.array(query_embedding).astype('float32'),
        k=top_k
    )

    retrieved_indices = []

    retrieved_scores = []

    # Similarity filtering
    for score, idx in zip(D[0], I[0]):

        similarity = 1 / (1 + score)

        if similarity >= 0.45:

            retrieved_indices.append(idx)

            retrieved_scores.append(
                float(similarity)
            )

    # Error handling
    if len(retrieved_indices) == 0:

        return None, None, None, None

    dominant_type = get_dominant_case_type(I)

    return (

        df,

        retrieved_indices,

        retrieved_scores,

        dominant_type
    )


# =========================
# SIMILAR CASE RETRIEVAL
# =========================

def retrieve_similar_cases(
    query,
    top_k=5
):

    filtered_df, indices, scores, dominant_type = smart_retrieval(
        query,
        top_k=top_k
    )

    if filtered_df is None:

        return {
            "error":
            "No strong matches found"
        }

    results = []

    for idx, score in zip(indices, scores):

        row = filtered_df.iloc[idx]

        results.append({

            "case_title":
                str(row["case_title"])
                if "case_title" in row.index else "",

            "case_type":
                str(row["case_type"])
                if "case_type" in row.index else "",

            "sub_category":
                str(row["sub_category"])
                if "sub_category" in row.index else "",

            "legal_sections":
                str(row["legal_sections"])
                if "legal_sections" in row.index else "",

            "judgment_outcome":
                str(row["judgment_outcome"])
                if "judgment_outcome" in row.index else "",

            "judge_observation":
                str(row["judge_observation"])
                if "judge_observation" in row.index else "",

            "similarity_score":
                round(float(score) * 100, 2),

            "case_text":
                str(row["case_text"])
                if "case_text" in row.index else ""
        })

    return results


# =========================
# LEGAL SECTION PREDICTION
# =========================

def predict_legal_sections(
    query,
    top_k=5
):

    filtered_df, indices, scores, dominant_type = smart_retrieval(
        query,
        top_k=top_k
    )

    if filtered_df is None:

        return {
            "error":
            "No strong matches found"
        }

    all_sections = []

    for idx in indices:

        sections = str(
            filtered_df.iloc[idx][
                "legal_sections"
            ]
        )

        split_sections = sections.split(";")

        for sec in split_sections:

            sec = sec.strip()

            if sec:

                all_sections.append(
                    normalize_law(sec)
                )

    section_counts = Counter(all_sections)

    total = sum(
        section_counts.values()
    )

    results = []

    for sec, count in section_counts.items():

        confidence = round(
            (count / total) * 100,
            2
        )

        results.append({

            "section": sec,

            "confidence": confidence
        })

    results.sort(
        key=lambda x: x["confidence"],
        reverse=True
    )

    return results


# =========================
# EVIDENCE TO LAW MAPPING
# =========================

def dataset_evidence_law_mapping(
    query,
    top_k=5
):

    filtered_df, indices, scores, dominant_type = smart_retrieval(
        query,
        top_k=top_k
    )

    if filtered_df is None:

        return {
            "error":
            "No strong matches found"
        }

    evidence_map = defaultdict(list)

    for idx in indices:

        evidence_text = str(
            filtered_df.iloc[idx][
                "evidence_types"
            ]
        )

        legal_text = str(
            filtered_df.iloc[idx][
                "legal_sections"
            ]
        )

        evidence_list = evidence_text.split(',')

        law_list = legal_text.split(';')

        cleaned_laws = []

        for law in law_list:

            law = law.strip()

            if law and law.lower() != "nan":

                cleaned_laws.append(
                    normalize_law(law)
                )

        for ev in evidence_list:

            ev = ev.strip().lower()
            ev = ev.capitalize()


            if not ev:
                continue

            evidence_map[ev].extend(
                cleaned_laws
            )

    results = []

    for evidence, laws in evidence_map.items():

        law_counts = Counter(laws)

        filtered_laws = []

        for law, count in law_counts.items():

            if count >= 1:

                filtered_laws.append(law)

        if len(filtered_laws) == 0:
            continue

        results.append({

            "evidence": evidence,

            "laws": filtered_laws
        })

    return results


# =========================
# MISSING EVIDENCE DETECTION
# =========================

def detect_missing_evidence(
    query,
    top_k=5
):

    filtered_df, indices, scores, dominant_type = smart_retrieval(
        query,
        top_k=top_k
    )

    if filtered_df is None:

        return {
            "error":
            "No strong matches found"
        }

    all_evidence = []

    for idx in indices:

        evidence_text = str(
            filtered_df.iloc[idx][
                "evidence_types"
            ]
        )

        evidence_list = evidence_text.split(',')

        for ev in evidence_list:

            ev = ev.strip().lower()

            if ev:

                all_evidence.append(ev)

    evidence_counts = Counter(all_evidence)

    query_lower = query.lower()

    missing = []

    for evidence, count in evidence_counts.items():

        if count >= 2 and evidence not in query_lower:

            missing.append({

                "evidence": evidence
            })

    unique_missing = []

    seen = set()

    for item in missing:

        if item["evidence"] not in seen:

            unique_missing.append(item)

            seen.add(item["evidence"])

    return unique_missing


# =========================
# JUDGMENT ANALYTICS
# =========================

def judgment_pattern_analytics(
    query,
    top_k=5
):

    filtered_df, indices, scores, dominant_type = smart_retrieval(
        query,
        top_k=top_k
    )

    if filtered_df is None:

        return {
            "error":
            "No strong matches found"
        }

    outcome_list = []

    relief_list = []

    for idx in indices:

        outcome = str(
            filtered_df.iloc[idx][
                "judgment_outcome"
            ]
        ).strip()

        if outcome and outcome.lower() != "nan":

            outcome_list.append(outcome)

        relief = str(
            filtered_df.iloc[idx][
                "interim_relief_or_custody_status"
            ]
        ).strip()

        if relief and relief.lower() != "nan":

            relief_list.append(relief)

    outcome_counts = Counter(outcome_list)

    relief_counts = Counter(relief_list)

    total_outcomes = sum(
        outcome_counts.values()
    )

    total_reliefs = sum(
        relief_counts.values()
    )

    outcome_results = []

    relief_results = []

    for outcome, count in outcome_counts.items():

        percentage = round(
            (count / total_outcomes) * 100,
            2
        )

        outcome_results.append({

            "outcome": outcome,

            "percentage": percentage
        })

    for relief, count in relief_counts.items():

        percentage = round(
            (count / total_reliefs) * 100,
            2
        )

        relief_results.append({

            "relief": relief,

            "percentage": percentage
        })

    outcome_results.sort(
        key=lambda x: x["percentage"],
        reverse=True
    )

    relief_results.sort(
        key=lambda x: x["percentage"],
        reverse=True
    )

    return {

        "case_type": dominant_type,

        "outcome_analytics": outcome_results,

        "relief_analytics": relief_results
    }


# =========================
# MASTER PIPELINE
# =========================

def analyze_case(query):

    similar_cases = retrieve_similar_cases(
        query
    )

    legal_sections = predict_legal_sections(
        query
    )

    evidence_mapping = dataset_evidence_law_mapping(
        query
    )

    missing_evidence = detect_missing_evidence(
        query
    )

    analytics = judgment_pattern_analytics(
        query
    )

    return {

        "similar_cases":
            similar_cases,

        "legal_sections":
            legal_sections,

        "evidence_mapping":
            evidence_mapping,

        "missing_evidence":
            missing_evidence,

        "analytics":
            analytics
    }