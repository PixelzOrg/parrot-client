import * as SQLite from "expo-sqlite";
import moment from "moment";
import { getCurrentUserUid } from "../../FirebaseConfig";
import { calculateTotalMinutes } from "./Tools";

const db = SQLite.openDatabase("parrot.db");
let selectedDay = moment(new Date()).format("YYYY-MM-DD");
let calendarDay = new Date();

export function setDBDate(newDate) {
  selectedDay = newDate;
}

export function setDBCalendarDate(newDate) {
  calendarDay = newDate;
}

export async function getDBCalendarDate() {
  return calendarDay;
}

async function makeDBTable() {
  //db.closeAsync();
  //db.deleteAsync();
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS memories (id INTEGER PRIMARY KEY AUTOINCREMENT, userID TEXT, title TEXT, category TEXT, timeStart TEXT, timeEnd TEXT, date TEXT, summary TEXT, location TEXT, videoURI TEXT, transcript TEXT, longitude REAL, latitude REAL, social TEXT)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS calSummaries (id INTEGER PRIMARY KEY AUTOINCREMENT, userID TEXT, date TEXT, daysummary)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS chatHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, userID TEXT, date TEXT, time TEXT, sender TEXT, message TEXT)"
    );
  });
}

export function returnAllMemoriesFromDB() {
  makeDBTable();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //console.log("set up: " + selectedDay);
      tx.executeSql(
        "SELECT * FROM memories WHERE userID = ? AND date = ? ORDER BY timeStart DESC, timeEnd ASC",
        [getCurrentUserUid(), selectedDay],
        (txObj, resultSet) => {
          //console.log(resultSet.rows._array);
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export function getCategoryDistribution() {
  //console.log(selectedDay);
  makeDBTable();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT Count(), category FROM memories WHERE userID = ? AND date = ? GROUP BY category",
        [getCurrentUserUid(), selectedDay],
        (txObj, result) => {
          let object = [];
          result.rows._array.forEach((item) => {
            object = [
              ...object,
              {
                category: item["category"],
                count: item["Count()"],
              },
            ];
          });
          //console.log(JSON.stringify(object)); //this works
          resolve(object);
          //console.log(result.rows._array[0]["Count()"]);
        },
        (txObj, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export async function getTimeSpentPerCategory() {
  makeDBTable();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT category, timeStart, timeEnd FROM memories WHERE userID = ? AND date = ?",
        [getCurrentUserUid(), selectedDay],
        (txObj, result) => {
          const hashMap = {};
          let object = [];

          result.rows._array.forEach((item) => {
            let totalTime = calculateTotalMinutes(
              item["timeStart"],
              item["timeEnd"]
            );

            let keyToCheck = item["category"];
            if (keyToCheck in hashMap) {
              hashMap[keyToCheck] = hashMap[keyToCheck] + totalTime;
            } else {
              hashMap[keyToCheck] = totalTime;
            }
          });

          for (const key in hashMap) {
            object = [
              ...object,
              {
                category: key,
                minutes: hashMap[key],
              },
            ];
          }

          //console.log(result.rows._array);
          //console.log(JSON.stringify(object)); //this works
          resolve(JSON.stringify(object));
          //console.log(result.rows._array[0]["Count()"]);
          //resolve(JSON.stringify(result.rows._array));
        },
        (txObj, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export async function getTimeSpentSocial() {
  makeDBTable();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT social, timeStart, timeEnd FROM memories WHERE userID = ? AND date = ?",
        [getCurrentUserUid(), selectedDay],
        (txObj, result) => {
          const hashMap = {};
          let object = [];

          result.rows._array.forEach((item) => {
            let totalTime = calculateTotalMinutes(
              item["timeStart"],
              item["timeEnd"]
            );

            let keyToCheck = item["social"];
            if (keyToCheck in hashMap) {
              hashMap[keyToCheck] = hashMap[keyToCheck] + totalTime;
            } else {
              hashMap[keyToCheck] = totalTime;
            }
          });

          for (const key in hashMap) {
            object = [
              ...object,
              {
                social: key,
                minutes: hashMap[key],
              },
            ];
          }

          //console.log(result.rows._array);
          //console.log(JSON.stringify(object)); //this works
          resolve(JSON.stringify(object));
          //console.log(result.rows._array[0]["Count()"]);
          //resolve(JSON.stringify(result.rows._array));
        },
        (txObj, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export function getSocialDistribution() {
  //console.log(selectedDay);
  makeDBTable();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT Count(), social FROM memories WHERE userID = ? AND date = ? GROUP BY social",
        [getCurrentUserUid(), selectedDay],
        (txObj, result) => {
          let object = [];
          result.rows._array.forEach((item) => {
            object = [
              ...object,
              {
                socials: item["social"],
                count: item["Count()"],
              },
            ];
          });
          //console.log(JSON.stringify(object)); //this works
          resolve(object);
          //console.log(result.rows._array[0]["Count()"]);
        },
        (txObj, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export async function getSQLDailySummary() {
  makeDBTable();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM calSummaries WHERE userID = ? AND date = ?",
        [getCurrentUserUid(), selectedDay],
        (txObj, resultSet) => {
          //console.log(resultSet.rows._array);
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export async function setSQLDailySummary(summary) {
  makeDBTable();
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO calSummaries (userID, date, daysummary) values (?, ?, ?)",
      [getCurrentUserUid(), selectedDay, summary],
      (txObj, resultSet) => {
        console.log("Saved into SQL");
      },
      (txObj, error) => console.log(error)
    );
  });
}

export async function getSQLChatHistory() {
  makeDBTable();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM chatHistory WHERE userID = ? ORDER BY id",
        [getCurrentUserUid()],
        (txObj, resultSet) => {
          //console.log(resultSet.rows._array);
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export async function addToSQLChatHistory(message) {
  makeDBTable();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO chatHistory (userID, date, time, sender, message) values (?, ?, ?, ?, ?)",
        [
          getCurrentUserUid(),
          selectedDay,
          moment(new Date()).format("HH:mm"),
          message.sender,
          message.message,
        ],
        (txObj, resultSet) => {
          //console.log(resultSet.rows._array);
          resolve(resultSet.rows._array);
        },
        (txObj, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
}

export function addNewDBMemory(
  _title,
  _category,
  _timeStart,
  _timeEnd,
  _date,
  _summary,
  _location,
  _videoURI,
  _transcript,
  _latitude,
  _longitude,
  _social
) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO memories (userID, title, category, timeStart, timeEnd, date, summary, location, videoURI, transcript, longitude, latitude, social) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        getCurrentUserUid(),
        _title,
        _category,
        _timeStart,
        _timeEnd,
        _date,
        _summary,
        _location,
        _videoURI,
        _transcript,
        _latitude,
        _longitude,
        _social,
      ],
      (txObj, resultSet) => {
        console.log(
          getCurrentUserUid(),
          _title,
          _category,
          _timeStart,
          _timeEnd,
          _date,
          _summary,
          _location,
          _videoURI,
          _transcript,
          _latitude,
          _longitude,
          _social
        );
      },
      (txObj, error) => console.log(error)
    );
  });
}
