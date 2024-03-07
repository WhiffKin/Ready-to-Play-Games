from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from ..s3_helpers import ALLOWED_EXTENSIONS
from flask_wtf.file import FileField, FileAllowed
from app.models import Campaign

def name_exists(_form, field):
    # Checking if character name exists
    name = field.data
    char = Campaign.query.filter(Campaign.name == name).first()
    if char:
        raise ValidationError('Name is already in use.')
    
class CampaignForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), name_exists])
    map = StringField("map", validators=[DataRequired()])
    description = StringField("description", validators=[DataRequired()])
    background_sprite = FileField("background_sprite",  validators=[DataRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])

class UpdateCampaignForm(FlaskForm):
    name = StringField("name", validators=[DataRequired()])
    description = StringField("description", validators=[DataRequired()])
    background_sprite = FileField("background_sprite",  validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
