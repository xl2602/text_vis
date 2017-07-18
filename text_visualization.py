from flask import Flask, render_template, request, jsonify

import numpy as np
import pandas as pd
import json
import string
import nltk
from nltk.corpus import stopwords
from sklearn.preprocessing import normalize
from random import shuffle
from collections import Counter
import os


# df = pd.read_csv('static/data/001ssb.txt', header=None, sep='||')
# text = " ".join(df[0].tolist())
# lowers = text.lower()
#
# # for python 3
# table = str.maketrans({key: None for key in string.punctuation})
# no_punctuation = lowers.translate(table)
#
# tokens = nltk.word_tokenize(no_punctuation)
#
# filtered = [w for w in tokens if not w in stopwords.words('english')]
# count = Counter(filtered)
# mc = count.most_common(100)
# pd.DataFrame(mc).to_csv('text_vis/static/data/most_common_wc.txt')

app = Flask(__name__)

base_dir = os.path.dirname(os.path.abspath(__file__))


@app.route('/')
def index():
    return render_template('index.html')


@app.route("/word_count")
def word_count():
    df = pd.read_csv(os.path.join(base_dir, 'static', 'data', 'most_common_wc.txt'))
    df.columns = ['text', 'count']
    df['size'] = normalize(df['count'].reshape(1, -1))[0]*300
    data = df.to_dict('records')
    return jsonify(wc=data)


@app.route("/shuffle_text")
def shuffle_text():
    df = pd.read_csv(os.path.join(base_dir, 'static', 'data', 'top10k.txt'), header=None, sep="|")
    shuffled_idx = list(range(len(df)))
    shuffle(shuffled_idx)
    data = df.iloc[shuffled_idx][0].tolist()[:20]
    return jsonify(st=data)


if __name__ == '__main__':
    app.run()
