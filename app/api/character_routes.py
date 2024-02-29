from flask import Blueprint
from app.models import Character

character_routes = Blueprint('characters', __name__)

@character_routes.route("")
def all_chars():
    '''
    Get all characters that are submitted to the db.
    TODO: Implement pagination
    '''

    chars = Character.query.all()
    return { "characters": [char.to_dict() for char in chars] }

@character_routes.route("/<int:id>")
def single_char(id):
    '''
    Get the stats for a single character
    '''
    char = Character.query.get(id)
    return char.to_dict_stats()