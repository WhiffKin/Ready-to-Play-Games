from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from ..s3_helpers import ALLOWED_EXTENSIONS
from flask_wtf.file import FileField, FileAllowed
from app.models import Character

def name_exists(_form, field):
    # Checking if character name exists
    name = field.data
    char = Character.query.filter(Character.name == name).first()
    if char:
        raise ValidationError('Name is already in use.')

def test_alignment(_form, field):
    # Checking if alignment is a required value
    alignment = field.data
    if alignment not in (
           ["Lawful_Good",
            "Chaotic_Good",
            "Lawful_Neutral",
            "Chaotic_Neutral",
            "Lawful_Evil",
            "Chaotic_Evil"]):
        raise ValidationError("Alignment is not an accepted value.") 

def test_class(_form, field):
    # Checking if alignment is a required value
    alignment = field.data
    if alignment not in (
           ["Monk",
            "Paladin",
            "Ranger",
            "Sorcerer"]):
        raise ValidationError("Class is not an accepted value.")        

class CharacterForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), name_exists])
    alignment = StringField("alignment", validators=[DataRequired(), test_alignment])
    classType = StringField("classType", validators=[DataRequired(), test_class])
    strength = IntegerField("strength", validators=[DataRequired()])
    dexterity = IntegerField("dexterity", validators=[DataRequired()])
    wisdom = IntegerField("wisdom", validators=[DataRequired()])
    charisma = IntegerField("charisma", validators=[DataRequired()])
    sprite = FileField("sprite", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    description = StringField("description", default="")     

class UpdateCharacterForm(FlaskForm):
    name = StringField("name", validators=[DataRequired()])
    alignment = StringField("alignment", validators=[DataRequired(), test_alignment])
    classType = StringField("classType", validators=[DataRequired(), test_class])
    strength = IntegerField("strength", validators=[DataRequired()])
    dexterity = IntegerField("dexterity", validators=[DataRequired()])
    wisdom = IntegerField("wisdom", validators=[DataRequired()])
    charisma = IntegerField("charisma", validators=[DataRequired()])
    sprite = FileField("sprite", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    description = StringField("description", default="")
