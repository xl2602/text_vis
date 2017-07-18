from flask import Flask, render_template, request, jsonify

import numpy as np
import pandas as pd
import json
import string
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
    df = pd.read_csv(os.path.join(base_dir, 'static', 'data', 'wc_one_cat.csv'))
    df.columns = ['text', 'count']
    df['size'] = normalize(df['count'].reshape(1, -1))[0]*300
    data = df.iloc[:70].to_dict('records')
    return jsonify(wc=data)


@app.route("/shuffle_text")
def shuffle_text():
    keyword = request.args.get('keyword')
    color = request.args.get('color', default="black")
    print(color)

    df = pd.read_csv(os.path.join(base_dir, 'static', 'data', 'translated_turkey.csv'))

    col_name = 'Clue_translation_en'
    cat_col_name = 'Customer Clue_translation_en'
    selected_cat = df[cat_col_name].unique()[0]
    # wc_data = df[df[cat_col_name] == selected_cat][col_name]

    if keyword:
        idx = df[df[col_name].str.contains(keyword, case=False)].index.values
    else:
        idx = df.index.values

    shuffle(idx)
    if len(idx) > 10:
        select_idx = idx[:10]
    else:
        select_idx = idx

    data = df.iloc[select_idx][col_name].tolist()
    return jsonify(st=data, kw=keyword, fc=color)


if __name__ == '__main__':
    app.run()

