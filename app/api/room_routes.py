from flask import Blueprint, request, jsonify
from app.models import db, Room, EnvironmentPiece
from app.forms import RoomForm
from flask_login import current_user, login_required
import app.s3_helpers as s3

room_routes = Blueprint('rooms', __name__)

@room_routes.route("")
def all_temps():
    '''
    Get all rooms that are submitted to the db.
    TODO: Implement pagination
    '''

    templates = Room.query.all()
    return { "rooms": [template.to_dict() for template in templates] }

@room_routes.route("/<int:id>")
def single_temp(id):
    '''
    Get the stats for a single room.
    '''
    template = Room.query.get(id)
    return template.to_dict_detailed()

@room_routes.route("", methods=["POST"])
@login_required
def post_room():
    '''
    Create a room with the given environment pieces.
    '''
    form = RoomForm();
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        room = Room(name=form.data["name"])
        env_pieces = []

        submissions = {
            "background_sprite": form.data["background_sprite"],
        }

        if form.data["front_left"]:
            submissions["front_left"] = form.data["front_left"]
        if form.data["front_center"]:
            submissions["front_center"] = form.data["front_center"]
        if form.data["front_right"]:
            submissions["front_right"] = form.data["front_right"]
        if form.data["back_left"]:
            submissions["back_left"] = form.data["back_left"]
        if form.data["back_center"]:
            submissions["back_center"] = form.data["back_center"]
        if form.data["back_right"]:
            submissions["back_right"] = form.data["back_right"]
        if form.data["obstacle"]:
            submissions["obstacle"] = form.data["obstacle"]
        if form.data["wall"]:
            submissions["wall"] = form.data["wall"]
        
        for key in submissions:
            file = submissions[key]
            file.filename = s3.get_unique_filename(file.filename)
            upload = s3.upload_file_to_s3(file)
            if key == "background_sprite":
                room.background_sprite = upload["url"]
            else:
                env_pieces.append(EnvironmentPiece(room=room, sprite=upload["url"], location=key))

        db.session.add(room)
        db.session.add_all(env_pieces)
        db.session.commit()
        return room.to_dict(), 201
    return { "errors": form.errors }, 400
