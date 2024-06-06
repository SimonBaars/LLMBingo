# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from bingocard import ez_bingo_card
import json
from flask import jsonify

initialize_app()

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["http://localhost:3000"],
        cors_methods=["get", "post", "options"],
    )
)
def card(req: https_fn.Request) -> https_fn.Response:
    if req.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 
            'Access-Control-Allow-Headers': 'Content-Type', 
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers)
    headers = {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
    }

    bingo_card = ez_bingo_card()
    return jsonify(bingo_card)
