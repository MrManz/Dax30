from flask import Flask, send_from_directory
import pandas as pd

app = Flask(__name__, static_url_path='/static/')


@app.route('/')
def hello_world():
    return app.send_static_file('index.html')

@app.route('/static/<path:path>')
def send_js(path):
    return send_from_directory('static', path)

@app.route('/api/')
def getStockValues():
    url = "http://chart.finance.yahoo.com/table.csv?s=FME.DE&a=10&b=8&c=1999&d=1&e=8&f=2030&g=d&ignore=.csv"
    df = pd.read_csv(url, usecols=['Date', 'Open','High', 'Low', 'Adj Close', 'Volume'], )
    df.rename(columns={'Adj Close': 'Close'}, inplace=True)
    return df.to_csv(columns=['Date', 'Open','High', 'Low', 'Close', 'Volume'], index=False)

if __name__ == '__main__':
    app.run()
