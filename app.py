import streamlit as st
from PIL import Image
import google.generativeai as genai

st.set_page_config(page_title="Murphy AI", layout="wide")

st.title("Murphy AI Technical Analyst 🚀")

# Gemini API Key
genai.configure(api_key="AIzaSyCivnMXkNOHYFySIl9vCOQ0mCzCi3UJGrE")

uploaded_file = st.file_uploader(
    "Upload Trading Chart Screenshot",
    type=["png", "jpg", "jpeg"]
)

if uploaded_file:

    image = Image.open(uploaded_file)

    st.image(image, caption="Uploaded Chart", use_column_width=True)

    model = genai.GenerativeModel("models/gemini-1.5-flash")
    
    with st.spinner("Murphy is analyzing chart..."):

        response = model.generate_content([
            """
            You are a professional technical analyst.

            Analyze this chart:
            - Trend
            - Support resistance
            - Candlestick behavior
            - Possible breakout
            - Buy or sell probability
            - Risk level
            - Market sentiment

            Explain in simple trader language.
            """,
            image
        ])

    st.subheader("Murphy AI Analysis")

    st.write(response.text)
