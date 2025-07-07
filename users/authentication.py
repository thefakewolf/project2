from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions
from firebase_admin import auth
import firebase_admin

User = get_user_model()

class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Firebase token based authentication.
    
    Clients should authenticate by passing the token key in the "Authorization"
    HTTP header, prepended with the string "Bearer ".  For example:
    
        Authorization: Bearer 401f7ac837da42b97f613d789819ff93537bee6a
    """
    
    keyword = 'Bearer'
    
    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()
        
        if not auth_header or auth_header[0].lower() != self.keyword.lower().encode():
            return None
            
        if len(auth_header) == 1:
            msg = 'Invalid token header. No credentials provided.'
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth_header) > 2:
            msg = 'Invalid token header. Token string should not contain spaces.'
            raise exceptions.AuthenticationFailed(msg)
            
        try:
            token = auth_header[1].decode()
        except UnicodeError:
            msg = 'Invalid token header. Token string should not contain invalid characters.'
            raise exceptions.AuthenticationFailed(msg)
            
        return self.authenticate_credentials(token)
    
    def authenticate_credentials(self, token):
        try:
            # Verify the Firebase ID token
            decoded_token = auth.verify_id_token(token)
            firebase_uid = decoded_token['uid']
            email = decoded_token.get('email', '')
            name = decoded_token.get('name', '')
            
        except Exception as e:
            raise exceptions.AuthenticationFailed('Invalid Firebase token.')
        
        try:
            # Try to get existing user by firebase_uid
            user = User.objects.get(firebase_uid=firebase_uid)
        except User.DoesNotExist:
            # Create new user if doesn't exist
            user = User.objects.create_user(
                username=email or firebase_uid,
                email=email,
                firebase_uid=firebase_uid,
                first_name=name.split(' ')[0] if name else '',
                last_name=' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else ''
            )
        
        return (user, token)