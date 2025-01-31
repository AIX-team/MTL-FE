import os

# 프로젝트 루트 경로
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# 벡터 DB 경로
VECTOR_DB_PATH = os.path.join(PROJECT_ROOT, "src/ai_vector/vector_dbs/main_vectordb")

# 요약 파일 저장 경로
SUMMARY_DIR = os.path.join(PROJECT_ROOT, "src/ai_api/summaries")

# 기타 공통 설정들... 