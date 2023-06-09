from flask import jsonify
from . import api


@api.app_errorhandler(404)
def page_not_found(e):
    response = jsonify({'error': 'not found'})
    response.status_code = 404
    return response


@api.app_errorhandler(500)
def internal_server_error(e):
    response = jsonify({'error': 'server error'})
    response.status_code = 500
    return response
