from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime
from app.config import settings

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    scan_type = Column(String, index=True)  # message, image, url
    risk_level = Column(String, index=True)  # LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Integer)
    signal_count = Column(Integer)
    summary = Column(Text)
    full_json = Column(Text)  # Serialized complete JSON response
    content = Column(Text, nullable=True)  # Stored only if privacy setting allows

class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(String)

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        store_content = db.query(SystemSetting).filter(SystemSetting.key == "store_scan_content").first()
        if not store_content:
            db.add(SystemSetting(key="store_scan_content", value="false"))
            db.commit()
    finally:
        db.close()

# Initialize tables immediately
init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
