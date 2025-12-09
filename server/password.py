import bcrypt

def hash_password(password: str) -> str:
    """Hashes a password using a randomly generated salt."""

    password_bytes = password.encode('utf-8')
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    return hashed_password.decode('utf-8')

def check_password(user_password: str, hashed_password: str):
    """Checks if user password matches the hashed password from the database."""

    user_bytes = user_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')
    result = bcrypt.checkpw(user_bytes, hash_bytes)

    return result

# user_password = "apple"
# a = hash_password(user_password)
# b = hash_password(user_password)
# print(a)
# print(b)

# print(check_password(user_password, a))
# print(check_password(user_password, b))