import psycopg2

# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    port=5433,
    database="ecommerce_db",
    user="postgres",
    password="kkt1234"
)
cur = conn.cursor()

# Path to your CSV
csv_path = "C:/import/products.csv"

# Load data
with open(csv_path, "r", encoding="utf-8") as f:
    next(f)  # skip header
    cur.copy_expert("COPY products FROM STDIN WITH CSV HEADER DELIMITER ','", f)

conn.commit()
cur.close()
conn.close()
print("Data loaded successfully.")
