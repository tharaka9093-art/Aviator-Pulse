from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
import time
import random
import hashlib
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
)

# Initialize SQLite DB
def init_db():
    conn = sqlite3.connect("aviator.db", check_same_thread=False)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS rounds (
            round_id TEXT PRIMARY KEY,
            timestamp REAL,
            multiplier REAL
        )
    """)
    conn.commit()
    return conn

db_conn = init_db()

def generate_aviator_round():
    server_seed = "public_seed_2026"
    client_seed = "default"
    nonce = int(time.time() * 1000) % 1000000
    combined = f"{server_seed}:{client_seed}:{nonce}"
    hash_val = hashlib.sha256(combined.encode()).hexdigest()
    h = int(hash_val[:8], 16) / 0xFFFFFFFF
    multiplier = 0.99 / (1 - h) if h != 1 else 1000.0
    return {
        "round_id": f"sim_{nonce}",
        "timestamp": time.time(),
        "multiplier": min(round(multiplier, 2), 1000.0)
    }

def round_generator():
    while True:
        rnd = generate_aviator_round()
        db_conn.execute(
            "INSERT OR IGNORE INTO rounds VALUES (?, ?, ?)",
            (rnd["round_id"], rnd["timestamp"], rnd["multiplier"])
        )
        db_conn.commit()
        time.sleep(3)

threading.Thread(target=round_generator, daemon=True).start()

@app.get("/api/rounds")
def get_rounds():
    cur = db_conn.execute("SELECT round_id, timestamp, multiplier FROM rounds ORDER BY timestamp DESC LIMIT 50")
    return [{"round_id": r[0], "timestamp": r[1], "multiplier": r[2]} for r in cur.fetchall()]

@app.get("/api/stats")
def get_stats():
    cur = db_conn.execute("SELECT multiplier FROM rounds ORDER BY timestamp DESC LIMIT 1000")
    multipliers = [r[0] for r in cur.fetchall()]
    if not multipliers:
        return {"average_multiplier": 0, "high_mult_rate": 0, "total_rounds": 0}
    avg = sum(multipliers) / len(multipliers)
    high = len([m for m in multipliers if m > 10]) / len(multipliers)
    return {
        "average_multiplier": round(avg, 2),
        "high_mult_rate": round(high * 100, 2),
        "total_rounds": len(multipliers)
    }