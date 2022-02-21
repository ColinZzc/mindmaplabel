import json
import shutil
import time

from flask import Flask, render_template, request
from flask import jsonify
import os

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/filelist")
def json_file_list():
    filelist = []
    for p in os.listdir(tobeChecked):
        if os.path.isfile(os.path.join(tobeChecked, p)) and p[-4:] == 'json':
            filelist.append(p)
    filelist.sort()
    return jsonify(filelist)


@app.route("/label", methods=['post'])
def label():
    file_label_dic = request.get_json()
    fileName = file_label_dic["filename"]
    lab = file_label_dic["label"]
    # print(fileName)
    # print(lab)
    write_label(fileName, lab)

    with open('label.log', 'a') as log:
        log.write(fileName + " " + str(lab) + "\n")

    return ""


@app.route("/save")
def save():
    with open('label.log', 'r') as log:
        for line in log:
            filename, label = line.split()
            try:
                if label:
                    shutil.move(tobeChecked + filename, useful)
                else:
                    shutil.move(tobeChecked + filename, useless)
            except Exception as e:
                print(filename, e)
    os.rename("label.log", "label"+time.strftime("-%Y-%m-%d-%h:%m:%s")+".log")
    return ""


def write_label(fileName, label):
    with open(tobeChecked + fileName, 'rb+') as f:
        offset = -4
        while True:
            f.seek(offset, 2)
            lines = f.readlines()
            if len(lines) <= 1:
                offset -= 4
            elif len(lines) > 2:
                offset += 1
            else:
                break
        f.seek(offset, 2)
        f.readline()
        f.write(bytes("," + str(label).lower() + "]", encoding='utf-8'))

        # data = json.load(f)
        # if len(data) > 1:
        #     data[1] = label
        # else:
        #     data.append(label)
        # f.seek(0, 0)
        # json.dump(data, f, indent=4)


if __name__ == '__main__':
    data_path = './static/data/'
    tobeChecked = data_path + 'tobeCheck/'
    useful = data_path + "useful/"
    useless = data_path + "useless/"
    if not os.path.exists(useless):
        os.mkdir(useless)
    if not os.path.exists(useful):
        os.mkdir(useful)

    app.run()
