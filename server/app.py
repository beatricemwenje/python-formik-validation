from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from models import Customer, db

app = Flask(__name__)
CORS(app) 

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize db first
db.init_app(app)

# Then attach Migrate
migrate = Migrate(app, db)

@app.route("/customers", methods=['GET', 'POST'])
def customers():
    if request.method == 'GET':
        return make_response(
            jsonify([customer.to_dict() for customer in Customer.query.all()])
        )

    if request.method == 'POST':
        data = request.get_json()
        customer = Customer(
            name=data.get('name'),
            email=data.get('email'),
            age=data.get('age')
        )
        db.session.add(customer)
        db.session.commit()
        return make_response(jsonify({
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'age': customer.age
        }))

if __name__ == "__main__":
    app.run(port=5555, debug=True)
