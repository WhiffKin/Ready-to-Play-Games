from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from ..s3_helpers import ALLOWED_EXTENSIONS
from flask_wtf.file import FileField, FileAllowed
from app.models import CampaignTemplate

def name_exists(_form, field):
    # Checking if character name exists
    name = field.data
    temp = CampaignTemplate.query.filter(CampaignTemplate.name == name).first()
    if temp:
        raise ValidationError('Name is already in use.')      

class CampaignTemplateForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), name_exists])
    # List of Rooms (will contain ids)
    # List of environment sprites (with reference to room ids)