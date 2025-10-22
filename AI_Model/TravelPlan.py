import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv
# Configure Google Gemini API key

load_dotenv()

# Fetch API key
GOOGLE_API_KEY = os.getenv("GEMINI_API")
genai.configure(api_key=GOOGLE_API_KEY)


# Initialize the Gemini Pro model
model = genai.GenerativeModel('gemini-2.0-flash')

# Set page configuration
st.set_page_config(
    page_title="AI Travel Itinerary Generator",
    page_icon="🗺️",
    layout="wide"
)

def main():
    st.title("🗺️ AI Travel Itinerary Generator")
    st.subheader("Get a personalized cultural travel plan")
    
    # Define regions
    regions = [
        "Karnataka (South India)",
        "Rajasthan (North India)",
        "Kerala (South India)",
        "West Bengal (East India)",
        "Gujarat (West India)",
        "Himachal Pradesh (North India)",
        "Assam (Northeast India)"
    ]
    
    # User preferences
    col1, col2 = st.columns(2)
    
    with col1:
        selected_region = st.selectbox("Select a region:", regions)
        days = st.slider("Number of days:", 1, 10, 3)
    
    with col2:
        theme = st.multiselect(
            "Travel themes (select up to 3):",
            ["Heritage & History", "Food & Cuisine", "Arts & Crafts", "Nature & Landscapes", "Spiritual & Religious", "Local Lifestyle"],
            default=["Heritage & History"]
        )
        
        budget_level = st.select_slider(
            "Budget level:",
            options=["Budget", "Mid-range", "Luxury"],
            value="Mid-range"
        )
    
    # Additional preferences
    st.subheader("Additional preferences")
    col3, col4 = st.columns(2)
    
    with col3:
        accommodation_pref = st.radio(
            "Accommodation preference:",
            ["Standard hotels", "Heritage stays", "Homestays", "Mix of options"]
        )
    
    with col4:
        special_interests = st.text_input("Any special interests or requirements?")
    
    # Generate itinerary button
    if st.button("Generate Itinerary"):
        if len(theme) > 0:
            with st.spinner("Creating your personalized cultural itinerary..."):
                generate_travel_itinerary(selected_region, days, theme, budget_level, accommodation_pref, special_interests)
        else:
            st.warning("Please select at least one travel theme.")
    
    st.markdown("---")
    st.info("The AI Travel Itinerary Generator creates personalized cultural travel plans based on your preferences, leveraging Google Gemini to provide authentic local insights.")

def generate_travel_itinerary(region, days, themes, budget, accommodation, special_interests):
    # Create prompt for Gemini
    themes_str = ", ".join(themes)
    
    prompt = f"""Create a detailed cultural travel itinerary for {region} with the following preferences:
    - Duration: {days} days
    - Travel themes: {themes_str}
    - Budget level: {budget}
    - Accommodation preference: {accommodation}
    - Special interests: {special_interests if special_interests else "None"}
    
    For each day, include:
    1. Morning activities with specific cultural sites
    2. Recommended authentic local food experiences
    3. Afternoon/evening cultural activities
    4. Cultural insights that travelers typically miss
    5. Suggested accommodations matching the preference
    
    Format the itinerary day by day with clear headers and brief descriptions for each recommendation. Include local tips and cultural context throughout.
    """
    
    # Get response from Gemini
    response = model.generate_content(prompt)
    
    # Display the itinerary
    st.subheader(f"Your {days}-Day Cultural Itinerary for {region}")
    st.markdown(response.text)
    
    # Add a map visualization for the region
    st.subheader("Region Overview Map")
    
    # Extract the main region name without parentheses
    main_region = region.split("(")[0].strip()
    
    # Display a map centered on the region
    st.markdown(f"""
    <iframe width="100%" height="450" style="border:0" loading="lazy" allowfullscreen
    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAqN4eP6N5B2eQRTZnNEJJfj4jPobfI9Tg&q={main_region},India&zoom=7">
    </iframe>
    """, unsafe_allow_html=True)
    
    # Add download option
    st.download_button(
        label="Download Itinerary as Text",
        data=f"CULTURAL TRAVEL ITINERARY FOR {region.upper()}\n{'-'*50}\n{response.text}",
        file_name=f"cultural_itinerary_{main_region.replace(' ', '_').lower()}.txt",
        mime="text/plain"
    )

if __name__ == "__main__":
    main()