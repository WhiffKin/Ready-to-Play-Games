from flask import Blueprint, request, jsonify
from app.models import db, Campaign
from app.forms import CampaignForm, UpdateCampaignForm
from flask_login import current_user, login_required
import app.s3_helpers as s3
from math import sqrt 
from math import floor 

campaign_routes = Blueprint('campaigns', __name__)

@campaign_routes.route("")
@login_required
def all_my_campaigns():
    '''
    Get all characters that the user submitted to the db.
    TODO: Implement pagination
    '''

    chars = Campaign.query.filter(Campaign.user_id == current_user.id)
    return { "campaigns": [char.to_dict() for char in chars] }

@campaign_routes.route("/<int:id>")
@login_required
def single_char(id):
    '''
    Get the stats for a single character.
    '''
    campaign = Campaign.query.get(id)

    if not campaign:
        return { "message": "Campaign doesn't exist." }, 404

    # Check for authorization.
    if campaign.user_id != current_user.id:
        return { "message": "Authorization denied." }, 401  
    
    return campaign.to_dict()

@campaign_routes.route("", methods=["POST"])
@login_required
def post_char():
    '''
    Create a character using the CharacterForm and add it to the database.
    '''
    form = CampaignForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Post to AWS 
        sprite_file = form.data["background_sprite"]
        sprite_file.filename = s3.get_unique_filename(sprite_file.filename)
        upload = s3.upload_file_to_s3(sprite_file)
        url = upload['url']

        campaign = Campaign(
            name=form.data["name"],
            background_sprite=url,
            description=form.data["description"],
            map=form.data["map"],
            user=current_user,
        )
        
        db.session.add(campaign)
        db.session.commit()

        return campaign.to_dict(), 201

    return { "errors": form.errors }, 400

@campaign_routes.route("/<int:id>", methods=["POST"])
@login_required
def update_char(id):
    '''
    Update a character from the database if you are the user that created them.
    '''
    campaign = Campaign.query.get(id)

    if not campaign:
        return { "message": "Campaign doesn't exist." }, 404

    # Check for authorization.
    if campaign.user_id != current_user.id:
        return { "message": "Authorization denied." }, 401  
    
    form = UpdateCampaignForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        if form.data["name"] != campaign.name:
            named_campaign = Campaign.query.filter(Campaign.name == form.data["name"]).first()
            if named_campaign:
                return { "errors": { "name": "Name is already in use." } }, 400
            
        url = campaign.background_sprite
        sprite_file = form.data["background_sprite"]
        # Post to AWS if file is provided
        if sprite_file:
            # Delete any custom sprites.
            deleted = s3.remove_file_from_s3(campaign.background_sprite)
            if deleted != True:
                return deleted
                
            sprite_file.filename = s3.get_unique_filename(sprite_file.filename)
            upload = s3.upload_file_to_s3(sprite_file)
            url = upload['url']

        campaign.background_sprite=url
        campaign.name = form.data["name"]
        campaign.description=form.data["description"]
        
        db.session.add(campaign)
        db.session.commit()

        return campaign.to_dict(), 201

    return { "errors": form.errors }, 400

@campaign_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_char(id):
    '''
    Delete a character from the database if you are the user that created them.
    '''
    campaign = Campaign.query.get(id)

    if not campaign:
        return { "message": "Campaign doesn't exist." }, 404

    # Check for authorization.
    if campaign.user_id != current_user.id:
        return { "message": "Authorization denied." }, 401    
    
    # Delete the background image.
    deleted = s3.remove_file_from_s3(campaign.background_sprite)
    if deleted != True:
        return deleted

    db.session.delete(campaign)
    db.session.commit()
    return { "message": "Successfully deleted." }, 200
    
