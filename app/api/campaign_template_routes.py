from flask import Blueprint, request, jsonify
from app.models import db, CampaignTemplate
from app.forms import CampaignTemplateForm
from flask_login import current_user, login_required
import app.s3_helpers as s3
from math import sqrt 
from math import floor 

campaign_template_routes = Blueprint('templates', __name__)

@campaign_template_routes.route("")
def all_chars():
    '''
    Get all campaign templates that are submitted to the db.
    TODO: Implement pagination
    '''

    templates = CampaignTemplate.query.all()
    return { "templates": [template.to_dict() for template in templates] }

@campaign_template_routes.route("/<int:id>")
def single_char(id):
    '''
    Get the stats for a single campaign template.
    '''
    template = CampaignTemplate.query.get(id)
    return template.to_dict_stats()

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
        print("---------------------")
        print(form)
        print("---------------------")
        print(form.data)
        print("---------------------")

        return {"message": "Being implemented."}, 201

    return { "errors": form.errors }, 400
    
