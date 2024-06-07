import firebase_admin
from firebase_admin import firestore

def get_firestore():
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    return firestore.client()

def add_score(name, score):
    db = get_firestore()
    scoreboard = db.collection('scoreboard').add({
        'name': name,
        'score': score,
        'timestamp': firestore.SERVER_TIMESTAMP
    })
    return scoreboard

def get_scores():
    db = get_firestore()
    scores = db.collection('scoreboard').order_by('score', direction=firestore.Query.DESCENDING).limit(10).stream()
    return [score.to_dict() for score in scores]

def add_and_get_scores(name, score):
    add_score(name, score)
    return get_scores()
