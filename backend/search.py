from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import AgglomerativeClustering
from collections import defaultdict

vectorizer = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 2)
)

def score_locations(query: str, locations: list[dict]):
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

def group_attributes(target_keyword: str, keywords: list[str]):
    X = vectorizer.fit_transform(keywords)

    clusterer = AgglomerativeClustering(
        metric="cosine",
        linkage="average",
        distance_threshold=0.4,
        n_clusters=None
    )

    labels = clusterer.fit_predict(X.toarray())

    clusters = defaultdict(list)
    for label, keyword in zip(labels, keywords):
        clusters[label].append(keyword)

    for k, v in clusters.items():
        print(f"Cluster {k}: {v}")
    
    return clusters

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
