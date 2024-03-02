from flask import Blueprint, request, jsonify
from app.models import db, Character
from app.forms import CharacterForm
from flask_login import current_user, login_required
import app.s3_helpers as s3

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
    Get the stats for a single character.
    '''
    char = Character.query.get(id)
    return char.to_dict_stats()

@character_routes.route("", methods=["POST"])
@login_required
def post_char():
    '''
    Create a character using the CharacterForm and add it to the database.
    '''
    form = CharacterForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        url = "No Image"
        sprite_file = form.data["sprite"]
        print("================================\n", sprite_file, form.data, "\n================================")
        
        # Post to AWS if file is provided
        if sprite_file:
            sprite_file.filename = s3.get_unique_filename(sprite_file.filename)
            upload = s3.upload_file_to_s3(sprite_file)
            print(dir(sprite_file))
            url = upload['url']
        else: 
            # Otherwise use a default class picture
            value = form.data["classType"]
            if value == "Monk":
                url = "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Monk.png"
            elif value == "Paladin":
                url = "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Paladin.png"
            elif value == "Ranger":
                url = "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Ranger.png"
            else:
                url = "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Sorcerer.png"

        char = Character(
            name=form.data["name"],
            sprite=url,
            description=form.data["description"],
            strength=form.data["strength"],
            dexterity=form.data["dexterity"],
            wisdom=form.data["wisdom"],
            charisma=form.data["charisma"],
            experience=0,
            alignment=form.data["alignment"],
            class_type=form.data["classType"],
        )
        
        # If a user submitted with more skill points than 
        # they should have for character creation, set skills
        # to a value of 7
        if 40 > (char.strength 
               + char.dexterity 
               + char.wisdom 
               + char.charisma):
            char.strength  = 7
            char.dexterity = 7
            char.wisdom    = 7
            char.charisma  = 7

        char.user = current_user
        
        db.session.add(char)
        db.session.commit()

        return char.to_dict(), 201

    return { "errors": form.errors }, 400

@character_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_char(id):
    '''
    Delete a character from the database if you are the user that created them.
    '''
    char = Character.query.get(id)

    # Check for authorization.
    if char.user_id != current_user.id:
        return { "message": "Authorization denied." }, 401    
    
    # Delete any custom sprites.
    if char.sprite not in (
       ["https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Monk.png",
        "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Paladin.png",
        "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Ranger.png",
        "https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Sorcerer.png"]):
        deleted = s3.remove_file_from_s3(char.sprite)
        if deleted != True:
            return deleted

    db.session.delete(char)
    db.session.commit()
    return { "message": "Successfully deleted." }, 200
    
