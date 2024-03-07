from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from ..s3_helpers import ALLOWED_EXTENSIONS
from flask_wtf.file import FileField, FileAllowed
from app.models import Character      

class RoomForm(FlaskForm):
    name = StringField("name", validators=[DataRequired()])
    background_sprite = FileField("background_sprite",  validators=[DataRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    front_left = FileField("front_left",  validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    front_center = FileField("front_center",  validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    front_right = FileField("front_right",  validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    back_left = FileField("back_left",  validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    back_center = FileField("back_center",  validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    back_right = FileField("back_right",  validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    obstacle = FileField("obstacle",  validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    wall = FileField("wall",  validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    