import os
import random

def read_words_from_directory(directory):
    words = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.txt'):
                with open(os.path.join(root, file), 'r') as f:
                    words.extend(f.read().splitlines())
    return words

def generate_bingo_card(is_adult, use_adjectives, use_verbs, use_nouns, board_size):
    base_dir = 'AllWords'
    words = []
    if use_adjectives:
        words.extend(read_words_from_directory(os.path.join(base_dir, 'Adjective_Safe')))
        if is_adult:
            words.extend(read_words_from_directory(os.path.join(base_dir, 'Adjective_18')))
    if use_verbs:
        words.extend(read_words_from_directory(os.path.join(base_dir, 'Verb_Safe')))
        if is_adult:
            words.extend(read_words_from_directory(os.path.join(base_dir, 'Verb_18')))
    if use_nouns:
        words.extend(read_words_from_directory(os.path.join(base_dir, 'Noun_Safe')))
        if is_adult:
            words.extend(read_words_from_directory(os.path.join(base_dir, 'Noun_18')))
    
    if len(words) < board_size * board_size:
        raise ValueError("Not enough words to fill the bingo card")

    random.shuffle(words)
    bingo_card = [words[i * board_size:(i + 1) * board_size] for i in range(board_size)]
    return bingo_card

def print_bingo_card(bingo_card):
    for row in bingo_card:
        print(" | ".join(row))
    print("\n")

def ez_bingo_card() -> list[list[str]]:
    return generate_bingo_card(1, 1, 1, 0, 5)
