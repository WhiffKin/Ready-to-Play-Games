from flask import Blueprint, request, jsonify
from app.models import db, CampaignTemplate, Room
from app.forms import CampaignTemplateForm
from flask_login import current_user, login_required
import app.s3_helpers as s3

campaign_template_routes = Blueprint('templates', __name__)

@campaign_template_routes.route("")
def all_temps():
    '''
    Get all campaign templates that are submitted to the db.
    TODO: Implement pagination
    '''

    templates = CampaignTemplate.query.all()
    return { "templates": [template.to_dict() for template in templates] }

@campaign_template_routes.route("/<int:id>")
def single_temp(id):
    '''
    Get the stats for a single campaign template.
    '''
    template = CampaignTemplate.query.get(id)
    return template.to_dict_detailed()

@campaign_template_routes.route("", methods=["POST"])
@login_required
def post_char():
    '''
    Create a template using the CampaignTemplateForm and add it to the database.
    '''
    form = CampaignTemplateForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Post to AWS
        sprite_file = form.data["background_sprite"]
        sprite_file.filename = s3.get_unique_filename(sprite_file.filename)
        upload = s3.upload_file_to_s3(sprite_file)
        url = upload['url']

        rooms = []
        room_ids = [room_data.split(";")[0] for room_data in form.data["rooms"].split(",")]
        for room_id in room_ids:
            room = Room.query.get(room_id)
            rooms.append(room)

        template = CampaignTemplate(
            name=form.data["name"],
            background_sprite=url,
            map=form.data["rooms"],
            user=current_user,
            rooms=rooms
        )

        db.session.add(template)
        db.session.commit()

        return template.to_dict(), 201
    return { "errors": form.errors }, 400
    