from Crypto.Cipher import AES
import base64
import os

class AESCipher:
    def __init__(self, key):
        self.key = key.ljust(32)[:32].encode()  # Ensure 32 bytes key
        self.iv = os.urandom(16)  # 16-byte IV for AES CBC mode

    def encrypt(self, raw_data):
        cipher = AES.new(self.key, AES.MODE_CBC, self.iv)
        padding_length = 16 - (len(raw_data) % 16)
        raw_data += bytes([padding_length]) * padding_length  # PKCS7 Padding
        encrypted = cipher.encrypt(raw_data)
        return base64.b64encode(self.iv + encrypted).decode()

    def decrypt(self, enc_data):
        enc_data = base64.b64decode(enc_data)
        iv = enc_data[:16]
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        decrypted = cipher.decrypt(enc_data[16:])
        padding_length = decrypted[-1]
        return decrypted[:-padding_length]  # Remove padding
