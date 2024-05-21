import pathlib
import mysql.connector
from mysql.connector import Error
from typing import Optional
import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError
import pathlib
from mysql.connector import Error
import json
import re
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator
import google.ai.generativelanguage as glm


GOOGLE_API_KEY="AIzaSyDtzlKC33d-j_5Ke3p81Wfmv9ycwgj8wdw"

connection = None


def connect_to_database():
    global connection
    try:
        connection = mysql.connector.connect(
                host="mazad-mysql-mazad-0524.a.aivencloud.com",
                database="mazad",
                user="avnadmin",
                password="AVNS_MeCGygQaQ80vJOt4tj5",
                port="12511",
        )
        print("Connected to MySQL database")
    except Error as e:
        print("Error connecting to MySQL database", e)

def close_database_connection():
    global connection
    if connection and connection.is_connected():
        connection.close()
        print("MySQL connection is closed")

def get_pending_items():
    try:
        cursor = connection.cursor()

        sql_select_Query = "SELECT a.id, a.itemId, a.startTime, a.finishTime, a.status, i.name, i.description FROM Auctions a JOIN Items i ON a.itemId = i.id WHERE a.status = %s ORDER BY i.id ASC LIMIT 1"
        cursor.execute(sql_select_Query, ('pending',))

        record = cursor.fetchone()

        cursor.close()

        return record
    except Error as e:
        print("Error reading data from MySQL table", e)

def get_item_images(item_id):
    try:
        cursor = connection.cursor()

        sql_select_Query = "SELECT imgURL FROM Images WHERE itemId = %s"
        cursor.execute(sql_select_Query, (item_id,))

        records = cursor.fetchall()

        cursor.close()

        return records
    except Error as e:
        print("Error reading data from MySQL table", e)

def kill_auction(auction_id):
    try:
        cursor = connection.cursor()
        sql_select_Query = "UPDATE Auctions SET status = %s WHERE id = %s"
        cursor.execute(sql_select_Query, ('killed', auction_id))
        connection.commit()

        cursor.close()
    except Error as e:
        print("Error reading data from MySQL table", e)

# define the json response for the item
class ItemValidation(BaseModel):
    is_legal: bool = Field(..., description="Is the item legal to be sold?")
    is_safe: bool = Field(..., description="Is the item safe to be sold?")
    reason: Optional[str] = Field(None, description="Reason for the legality or safety status.")

class ImageValidation(BaseModel):
    is_clean: bool = Field(..., description="Does the image contain any sexual content or gore or drugs or any illegal content?")

def model_to_json(model_instance):
    """
    Converts a Pydantic model instance to a JSON string.

    Args:
        model_instance (BaseModel): An instance of your Pydantic model.

    Returns:
        str: A JSON string representation of the model.
    """
    return model_instance.json()

def extract_json(text_response):
    # This pattern matches a string that starts with '{' and ends with '}'
    pattern = r'\{[^{}]*\}'
    matches = re.finditer(pattern, text_response)
    json_objects = []
    for match in matches:
        json_str = match.group(0)
        try:
            # Validate if the extracted string is valid JSON
            json_obj = json.loads(json_str)
            json_objects.append(json_obj)
        except json.JSONDecodeError:
            # Extend the search for nested structures
            extended_json_str = extend_search(text_response, match.span())
            try:
                json_obj = json.loads(extended_json_str)
                json_objects.append(json_obj)
            except json.JSONDecodeError:
                # Handle cases where the extraction is not valid JSON
                continue
    if json_objects:
        return json_objects
    else:
        return None  # Or handle this case as you prefer

def extend_search(text, span):
    # Extend the search to try to capture nested structures
    start, end = span
    nest_count = 0
    for i in range(start, len(text)):
        if text[i] == '{':
            nest_count += 1
        elif text[i] == '}':
            nest_count -= 1
            if nest_count == 0:
                return text[start:i+1]
    return text[start:end]

def json_to_pydantic(model_class, json_data):
    try:
        model_instance = model_class(**json_data)
        return model_instance
    except ValidationError as e:
        print("Validation error:", e)
        return None

def validate_json_with_model(model_class, json_data):
    """
    Validates JSON data against a specified Pydantic model.

    Args:
        model_class (BaseModel): The Pydantic model class to validate against.
        json_data (dict or list): JSON data to validate. Can be a dict for a single JSON object, 
                                  or a list for multiple JSON objects.

    Returns:
        list: A list of validated JSON objects that match the Pydantic model.
        list: A list of errors for JSON objects that do not match the model.
    """
    validated_data = []
    validation_errors = []

    if isinstance(json_data, list):
        for item in json_data:
            try:
                model_instance = model_class(**item)
                validated_data.append(model_instance.dict())
            except ValidationError as e:
                validation_errors.append({"error": str(e), "data": item})
    elif isinstance(json_data, dict):
        try:
            model_instance = model_class(**json_data)
            validated_data.append(model_instance.dict())
        except ValidationError as e:
            validation_errors.append({"error": str(e), "data": json_data})
    else:
        raise ValueError("Invalid JSON data type. Expected dict or list.")

    return validated_data, validation_errors

def is_valid(json_data, model_class):
	validated_data, validation_errors = validate_json_with_model(ItemValidation, json_data)
	if validated_data:
		return True
	return False
# Example instance of the ItemValidation model for JSON structure reference

def generate_text(prompt):
	response = text_model.generate_content(prompt)
	return response.text
def generate_image(prompt, image_path):
  res = image_model.generate_content(
      glm.Content(
          parts=[
              glm.Part(text=prompt),
              glm.Part(
                  inline_data=glm.Blob(
                      mime_type='image/jpeg',
                      data=pathlib.Path(image_path).read_bytes()
                  )
              ),
          ]
      ),
      stream=False
  )
  # Access response data (replace with actual method based on library)
  safety_ratings = res.get("safety_ratings", {})
  return res, safety_ratings  # Return both response and safety ratings


text_example_instance = ItemValidation(is_legal=True, is_safe=True, reason="Complies with all regulations.")
image_example_instance = ImageValidation(is_clean=True, reason="does not contain any sexual content or gore or drugs or any illegal content.")
text_json_model = model_to_json(text_example_instance)
image_json_model = model_to_json(image_example_instance)

connect_to_database()
item = get_pending_items()
if not item:
	print("No pending items found.")
	close_database_connection()
	exit()


name = item[5]
html_description = item[6]
text_description = BeautifulSoup(html_description, "html.parser").get_text().split(" ")[:50]
description= " ".join(text_description)
# if the title is in Arabic, translate it to English
if re.match(r'[\u0600-\u06FF]+', name):
	name = GoogleTranslator(source='ar', target='en').translate(name)

if re.match(r'[\u0600-\u06FF]+', description):
	description = GoogleTranslator(source='ar', target='en').translate(description)


genai.configure(api_key=GOOGLE_API_KEY)
text_model = genai.GenerativeModel(model_name='gemini-1.0-pro')
image_model = genai.GenerativeModel(model_name='gemini-pro-vision')
chat = text_model.start_chat(enable_automatic_function_calling=True)

     

text_prompt = f'Can you analyze an item listing on an e-commerce site "{name}" for legality and safety?'
text_prompt += f' description of the item: {description}'
text_prompt += ' an item is considered illegal if it violates any laws or regulations of Jordan'
text_prompt += ' an item is considered unsafe, if it contains any hazardous materials or poses a risk to the user'
text_prompt += ' other than that, any other item is considered legal and safe to be sold on the platform.'

text_optimized_prompt = text_prompt + f' Please provide a response in a structured JSON format that matches the following model: {text_json_model}'

res = generate_text(text_optimized_prompt)

text_json_response = extract_json(res)

if text_json_response:
	if not is_valid(text_json_response, ItemValidation):
		print("The generated JSON does not match the expected model.")

allow = True
if type(text_json_response) == list:
    text_json_response = text_json_response[0]

# to parse with json
if not(type(text_json_response) == dict):
    try:
        text_json_response = json.loads(text_json_response)
    except json.JSONDecodeError:
        print("The generated JSON does not match the expected model.")
        text_json_response = {"is_legal": True, "is_safe": True, "reason": ""}
        pass
    
if not text_json_response['is_legal'] and not text_json_response['is_safe']:
	allow = False
 
if not allow:
    kill_auction(item[0])

# else, update the status of the auction to "new"
else:
    try:
        cursor = connection.cursor()
        sql_select_Query = "UPDATE Auctions SET status = %s WHERE id = %s"
        cursor.execute(sql_select_Query, ('new', item[0]))
        connection.commit()

        cursor.close()
    except Error as e:
        print("Error reading data from MySQL table", e)

close_database_connection()



# get the images and check if they have any sexual content or gore
# images = get_item_images(item[1])
# for img in images:
#     img_url = img[0]

#     image_prompt = f'Can you analyze this image for any sexual content or gore?'
#     image_optimized_prompt = image_prompt + f' Please provide a response in a structured JSON format that matches the following model: {image_json_model}'
#     image_url = img_url.replace("uploads/", "w-500/")

    
#     img_path = "./image.jpeg"
#     urllib.request.urlretrieve(img_url, img_path)

#     res = generate_image(image_optimized_prompt, img_path)
    
#     pathlib.Path(img_path).unlink()
#     json_objects = extract_json(res)

#     if json_objects:
#         if not is_valid(json_objects[0], ItemValidation):
#             print("The generated JSON does not match the expected model.")

#     if not json_objects['is_safe']:
#         kill_auction(item[0])
#         break
#     if not allow:
#         kill_auction(item[0])