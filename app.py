from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, current_user
import os

# Инициализация приложения
app = Flask(__name__)

# Конфигурация
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-fallback-key-123')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Инициализация расширений
db = SQLAlchemy(app)
login_manager = LoginManager(app)

# Модель пользователя
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)

# Обязательный загрузчик пользователя
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Главная страница
@app.route('/')
def home():
    return render_template('index.html', user=current_user)

# Создание тестового пользователя (для демонстрации)
@app.route('/create-test-user')
def create_test_user():
    if not User.query.filter_by(username='test').first():
        user = User(username='test')
        db.session.add(user)
        db.session.commit()
    return "Тестовый пользователь создан!"

# Инициализация БД
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)