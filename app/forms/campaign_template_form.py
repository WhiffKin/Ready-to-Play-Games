from flask_wtf import FlaskForm
from wtforms import StringField, FieldList
from wtforms.validators import DataRequired, ValidationError
from ..s3_helpers import ALLOWED_EXTENSIONS
from flask_wtf.file import FileField, FileAllowed
from app.models import CampaignTemplate, Room

def name_exists(_form, field):
    # Checking if character name exists
    name = field.data
    temp = CampaignTemplate.query.filter(CampaignTemplate.name == name).first()
    if temp:
        raise ValidationError('Name is already in use.')      

def room_exists(_form, field):
    # Checking if the room exists
    room_ids = [room_data.split(";")[0] for room_data in field.data.split(",")]
    for room_id in room_ids:
        room = Room.query.get(room_id)
        if not room:
            raise ValidationError("Room does not exist.")

class CampaignTemplateForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), name_exists])
    background_sprite = FileField("background_sprite",  validators=[DataRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    rooms = StringField("rooms", validators=[room_exists])