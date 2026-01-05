from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

vectorizer = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 2)
)

def score_locations(query: str, locations: list[str]):
    texts = [query] + locations
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
