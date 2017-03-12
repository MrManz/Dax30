from flask import Flask, send_from_directory
import pandas as pd
import urllib.request
import xml.etree.ElementTree as Et
import json

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def hello_world():
    return app.send_static_file('index.html')

@app.route('/static/<path:path>')
def send_js(path):
    return send_from_directory('static', path)

@app.route('/api/values')
def getStockValues():
    url = "http://chart.finance.yahoo.com/table.csv?s=FME.DE&a=10&b=8&c=2015&d=1&e=8&f=2030&g=d&ignore=.csv"
    df = pd.read_csv(url, usecols=['Date', 'Open', 'High', 'Low', 'Adj Close', 'Volume'], )
    df.rename(columns={'Adj Close': 'Close'}, inplace=True)
    return df.to_csv(columns=['Date', 'Open', 'High', 'Low', 'Close', 'Volume'], index=False)

@app.route('/api/news')
def getNews():

    with urllib.request.urlopen(
            'http://www.finanznachrichten.de/rss-fresenius-medical-care-ag-co-kgaa-aktien-de0005785802') as response:
        xml = response.read().decode('utf8')

    root = Et.fromstring(xml)

    news = []

    for elem in root[0].iter('item'):
        title = elem.find('title').text
        date = elem.find('pubDate').text
        news.append(date.replace('Z', '').replace('T', ' ').replace(':00', '') + " " + title)

    return json.dumps(news)

if __name__ == '__main__':
    app.run()
