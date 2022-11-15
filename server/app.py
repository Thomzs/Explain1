from flask import Flask, jsonify, Response
from src.data import Database
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
db = Database()


@app.route('/territory/<territory_id>/info')
@cross_origin()
def territory_info(territory_id):  # put application's code here
    try:
        data = db.get_territory_info(territory_id)
        return jsonify(data)
    except Exception:
        return jsonify("Internal Error"), 500


@app.route('/territory/<territory_id>/children')
@cross_origin()
def territory_children(territory_id):
    try:
        data = db.get_territory_children(territory_id)
        return jsonify(data)
    except Exception:
        return jsonify("Internal Error"), 500


@app.route('/search/<territory_name>')
@cross_origin()
def territory_by_name(territory_name):
    try:
        data = db.search_territory_by_name(territory_name)
        return jsonify(data)
    except Exception:
        return jsonify("Internal Error"), 500


if __name__ == '__main__':
    app.run()
