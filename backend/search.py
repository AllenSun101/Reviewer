from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import AgglomerativeClustering
from collections import defaultdict
from bson import ObjectId

vectorizer = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 2)
)

def score_locations(query: str, locations: list[dict]) -> list[tuple[dict, float]]:
    texts = [query] + [location["name"] for location in locations]
    tfidf = vectorizer.fit_transform(texts)

    query_vec = tfidf[0]
    location_vecs = tfidf[1:]

    scores = cosine_similarity(query_vec, location_vecs)[0]

    ranked = sorted(
        zip(locations, scores),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked

def get_locations_ratings(locations_filtered: list[tuple[dict, float]], preference_weights: list[dict], locations_db):
    ratings = []

    for location in locations_filtered:
        location_id = location[0]["_id"]
        location_reviews = locations_db.find_one({"_id": ObjectId(location_id)})
        location_keywords = location_reviews["review_keywords"]

        if len(location_keywords) == 0 or len(preference_weights) == 0:
            location[0]["rating"] = -1
            ratings.append(location[0])
            continue

        total_rating_points = 0.0
        total_weight = 0.0
        
        for preference_dict in preference_weights:
            preference = preference_dict["key"]
            weight = preference_dict["weight"]
            
            similar_keywords = find_similar_keywords(preference, list(location_keywords.keys()))
            lists = [location_keywords[k] for k in similar_keywords]
            flat = [item for sublist in lists for item in sublist]
            average_rating = sum(flat) / len(flat) if flat else 0
            total_rating_points += weight * average_rating
            total_weight += weight

        weighted_rating = round(total_rating_points / total_weight, 2)
        location[0]["rating"] = weighted_rating
        ratings.append(location[0])
    
    return ratings

def find_similar_keywords(target_keyword: str, keywords: list[str], threshold: float = 0.7):
    vectorizer = TfidfVectorizer(ngram_range=(1, 2))

    texts = [target_keyword] + keywords
    X = vectorizer.fit_transform(texts)

    target_vec = X[0]
    keyword_vecs = X[1:]

    similarities = cosine_similarity(target_vec, keyword_vecs)[0]
    scored = list(zip(keywords, similarities))
    scored.sort(key=lambda x: x[1], reverse=True)

    similar = [kw for kw, score in scored if score >= threshold]

    if len(similar) < 3:
        similar = [kw for kw, _ in scored[:3]]

    return similar

if __name__ == "__main__":
    locations = [
        "Coffee shop near campus",
        "Quiet library in city",
        "Bar in downtown city",
        "Restaurant close to downtown"
    ]

    query = "place to study near me"

    results = score_locations(query, locations)

    for loc, score in results:
        print(f"{score:.3f} | {loc}")
