import streamlit as st

st.title("Murphy AI Technical Analyst")

st.write("Murphy is running successfully 🚀")

uploaded_file = st.file_uploader("Upload Chart Screenshot")

if uploaded_file:
    st.image(uploaded_file, caption="Uploaded Chart", use_column_width=True)
    st.success("Chart uploaded successfully!")
