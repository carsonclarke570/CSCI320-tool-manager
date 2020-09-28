import os

from src import create
from src.models import db
from src.models.user import User
from src.models.tool import Tool
from src.models.project import Project
from src.models.category import Category

app = create()

@app.shell_context_processor
def make_shell_context():
    return dict(
        db=db, 
        User=User,
        Tool=Tool,
        Project=Project,
        Category=Category
    )