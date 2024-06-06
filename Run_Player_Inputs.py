import openai
import json
import os

# Function to read the configuration from a file
def get_config(file_path='config.txt'):
    config = {}
    with open(file_path, 'r') as f:
        for line in f:
            key, value = line.strip().split('=', 1)
            config[key.strip()] = value.strip()
    return config

# Load configuration
config = get_config()

# Set up your OpenAI API key
openai.api_key = config['API_KEY']

# Function to read and update round number and game state
def get_game_state(file_path=config['GAME_STATE_FILE']):
    if not os.path.exists(file_path):
        initial_state = {
            "round_number": 1,
            "history": [],
            "archive": []
        }
        with open(file_path, 'w') as f:
            json.dump(initial_state, f, indent=4)
        return initial_state
    
    with open(file_path, 'r') as f:
        game_state = json.load(f)
    
    return game_state

def update_game_state(file_path, game_state):
    with open(file_path, 'w') as f:
        json.dump(game_state, f, indent=4)

def get_gpt4_response(messages):
    completion = openai.chat.completions.create(
        model="gpt-4o",  # Ensure this model version is correct
        messages=messages,
        temperature=1,
        max_tokens=300,
        top_p=1,
        frequency_penalty=0.1,
        presence_penalty=0.1
    )
    response_content = completion.choices[0].message.content
    return response_content

def main():
    game_state = get_game_state()
    round_number = game_state["round_number"]
    
    input_text = input("Enter your input text: ")
    user_message = f"(Round #{round_number}) {input_text}"
    
    system_prompt = config['STARTING_PROMPT']
    
    if round_number == 1:
        messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_message}]
        game_state["history"].append(f"system: {system_prompt}")  # Include initial system prompt in the history
    else:
        messages = [
            {"role": "system", "content": system_prompt}
        ] + [
            {"role": "user", "content": msg.split(":", 1)[1].strip()} if msg.startswith("user:") else {"role": "assistant", "content": msg.split(":", 1)[1].strip()} 
            for msg in game_state["history"]
        ] + [
            {"role": "user", "content": user_message}
        ]
    
    response = get_gpt4_response(messages)
    
    # Archive the oldest user-GPT pair if more than 4 messages in history
    if len(game_state["history"]) > 3:
        game_state["archive"].extend(game_state["history"][:2])
        game_state["history"] = game_state["history"][2:]
    
    game_state["history"].append(f"user: {user_message}")
    game_state["history"].append(f"gpt: {response}")
    game_state["round_number"] += 1
    
    update_game_state(config['GAME_STATE_FILE'], game_state)
    
    print(f"Round: {round_number}\nResponse: {response}")

if __name__ == "__main__":
    main()
