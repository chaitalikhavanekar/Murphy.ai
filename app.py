import streamlit as st
from PIL import Image
import google.generativeai as genai

st.set_page_config(page_title="Murphy AI", layout="wide")
st.title("Murphy AI — Technical Analysis Assistant")
st.caption("Grounded in John J. Murphy's Technical Analysis of the Financial Markets")

# ── API KEY ──────────────────────────────────────────────────────────────────
# NEVER hardcode your key. Store it in Streamlit Secrets:
#   1. On Streamlit Cloud → Manage app → Secrets → add:
#        GEMINI_API_KEY = "your-key-here"
#   2. Locally → create .streamlit/secrets.toml and add the same line
# ─────────────────────────────────────────────────────────────────────────────
try:
    api_key = st.secrets["GEMINI_API_KEY"]
except Exception:
    st.error(
        "API key not found. "
        "Add GEMINI_API_KEY to your Streamlit Secrets "
        "(Manage app → Secrets on Streamlit Cloud, "
        "or .streamlit/secrets.toml locally)."
    )
    st.stop()

genai.configure(api_key=api_key)

# ── MURPHY SYSTEM PROMPT ─────────────────────────────────────────────────────
MURPHY_PROMPT = """
You are a senior technical analyst and market mentor.
Your reasoning is grounded strictly in the principles from
John J. Murphy's "Technical Analysis of the Financial Markets."

You are NOT a prediction engine. You do NOT guarantee outcomes.
You reason through charts like a disciplined analyst.

Analyze this chart and provide a structured assessment covering:

1. TREND STRUCTURE
   - What is the primary trend direction? (up / down / sideways)
   - Are higher highs and higher lows intact (uptrend)?
   - Are lower highs and lower lows intact (downtrend)?
   - Has the trend been violated or is it under pressure?

2. SUPPORT & RESISTANCE
   - Identify the key support levels visible on the chart.
   - Identify the key resistance levels visible on the chart.
   - Is price near a significant level right now?

3. VOLUME BEHAVIOR (if visible)
   - Is volume expanding on rallies or declines?
   - Does volume confirm or contradict the trend?

4. CHART PATTERNS
   - Are any recognizable Murphy patterns visible?
     (e.g. head and shoulders, double top/bottom, triangle, flag, channel)
   - What does the pattern imply structurally?

5. CONFIRMATIONS & CONTRADICTIONS
   - What evidence supports the current trend continuing?
   - What evidence contradicts or weakens the trend thesis?

6. RISK ASSESSMENT
   - Where would the trend be invalidated? (key level to watch)
   - What is the current risk level? (low / moderate / elevated / high)

7. WHAT TO MONITOR NEXT
   - What specific price levels or signals should the analyst watch?
   - What would confirm or invalidate the current structure?

Write clearly. Explain your reasoning. Be honest about uncertainty.
Do not make specific buy/sell recommendations.
Think like a mentor teaching a student to read charts correctly.
"""

# ── UI ────────────────────────────────────────────────────────────────────────
uploaded_file = st.file_uploader(
    "Upload a chart screenshot (PNG, JPG, JPEG)",
    type=["png", "jpg", "jpeg"]
)

if uploaded_file:
    image = Image.open(uploaded_file)
    st.image(image, caption="Chart under analysis", use_container_width=True)

    # FIX: correct model name for current Gemini API
    model = genai.GenerativeModel("gemini-1.5-flash")

    with st.spinner("Murphy AI is reading the chart..."):
        try:
            response = model.generate_content([MURPHY_PROMPT, image])
            st.subheader("Murphy AI Analysis")
            st.write(response.text)
        except Exception as e:
            st.error(f"Analysis failed: {e}")
            st.info(
                "Common fixes:\n"
                "- Check your GEMINI_API_KEY is valid and not revoked\n"
                "- Make sure the Gemini API is enabled in your Google Cloud project\n"
                "- Try a smaller image if the file is very large"
            )
