from flask import Blueprint
from app.models import User, Character

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    if not user: 
        return { "message": f"No user found with id: {id}."}, 404
    return user.to_dict_all()

@user_routes.route("/<int:id>/characters")
def user_chars(id):
    '''
    Query for characters that have the same user.
    '''
    chars = Character.query.find(Character.user_id == id)
    if not chars: 
        return { "message": f"No characters found for user with id: {id}."}
    return { "characters": [char.to_dict() for char in chars] }