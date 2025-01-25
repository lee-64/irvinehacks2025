import os
import requests
from urllib.parse import quote
from dotenv import load_dotenv
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import pandas as pd
import json
from groq import Groq
import numpy as np

load_dotenv()


def geocode_address(addr):
    """
    Normalize address string by removing special chars and standardizing format
    """
    if pd.isna(addr):
        return None
    geolocator = Nominatim(user_agent="Geopy Library")
    location = geolocator.geocode(query)

    return location


def find_zipcode_match(query, df, max_distance_miles=10):
    """
    Find closest zipcode based on geographical distance
    """
    try:
        # Geocode the query address
        location = geocode_address(query)

        if not location:
            return None

        query_lat = location.latitude
        query_lon = location.longitude

        # Calculate distances to all zipcodes
        df['distance'] = df.apply(
            lambda row: geodesic(
                (query_lat, query_lon),
                (row['Latitude'], row['Longitude'])
            ).miles,
            axis=1
        )

        # Find closest match within threshold
        closest = df.loc[df['distance'].idxmin()]

        if closest['distance'] <= max_distance_miles:
            return {
                'zipcode': closest['ZipCode'],
                'city': closest['City'],
                'state': closest['State'],
                'latitude': closest['Latitude'],
                'longitude': closest['Longitude'],
                'distance_miles': round(closest['distance']),
                'record_id': closest['RecordID'],
                'median_household_income': closest['MedianHouseholdIncome'],
                'per_capita_income': closest['PerCapitaIncome'],
                'median_home_value': closest['MedianHomeValue']
            }
        return None

    except Exception as e:
        print(f"Error: {e}")
        return None


def get_walk_metrics(addr, lat, lon):
    """
    Fetch score response from WalkScore API
    """
    try:

        walk_score_key = os.getenv("WALK_SCORE_API_KEY")
        walk_score_pre = "https://api.walkscore.com/score?format=json&address="
        walk_score_suf = f"&transit=1&bike=1&wsapikey={walk_score_key}"

        location = geocode_address(addr)
        encoded_address = quote(str(location))

        url = f"{walk_score_pre}{encoded_address}&lat={lat}&lon={lon}{walk_score_suf}"
        response = requests.get(url).json()
        # print(response)
        return response

    except:
        return None


def get_system_context():
    """
    Get system context
    """
    try:
        with open('system_context.txt', 'r') as f:
            ctx = f.read()
            return ctx
    except FileNotFoundError:
        print('Warning: system_context.txt not found')
        return ''

def generate_llm_score(data):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": get_system_context()
            },
            {
                "role": "user",
                "content": json.dumps(data, default=convert_numpy)
            }
        ],
        model="llama-3.3-70b-versatile",
    )

    print(chat_completion.choices[0].message.content)


def convert_numpy(obj):
    if isinstance(obj, np.integer): return int(obj)
    if isinstance(obj, np.floating): return float(obj)
    if isinstance(obj, np.ndarray): return obj.tolist()
    if isinstance(obj, np.bool_): return bool(obj)
    if isinstance(obj, np.nan): return None
    return obj


def get_safety_metrics(city):
    offenses = pd.read_csv('../data/ca_offenses_by_city.csv')
    law_enforcement = pd.read_csv('../data/ca_law_enforcement_by_city.csv')
    city = city.title()
    try:
        row_off = offenses[offenses['City'] == city].to_dict('records')[0]
        row_law = law_enforcement[law_enforcement['City'] == city].to_dict('records')[0]

        safety_data = {}
        safety_data.update(row_off)
        safety_data.update(row_law)
        return safety_data

    except KeyError:
        print("City safety data not found")
        return None


if __name__ == "__main__":
    # TODO default address when page initially loads is Lebron's address
    df = pd.read_csv('../data/ZipData.csv')
    query = "3651 trousdale"
    match_data = find_zipcode_match(query, df)
    # print(match_data)
    if match_data is not None:
        safety_data = get_safety_metrics(match_data['city'])

        walk_data = get_walk_metrics(query, match_data['latitude'], match_data['longitude'])

        # The LLM decides...
        combined_data = {
            'match_data': match_data,
            'safety_data': safety_data,
            'walk_score': walk_data
        }

        score = generate_llm_score(combined_data)
