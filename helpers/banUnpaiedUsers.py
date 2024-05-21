#  a python script, that will run once every 6 hours

# how it runs:
# a cron job will run the script every 6 hours
# 1- make sure ur sudo on the server (sudo -i)
# 2- run the command: crontab -e (now you are in vim)
# 3- change the cron expression as needed
# 4- esc -> :wq -> enter


# Description:
# the script will connect to the database, and checks for auctions that have ended, and ban users if they have not paid for the item within two days

import mysql.connector
from mysql.connector import Error
import datetime
import datetime
import pytz


def banUnpaiedUsers():
    try:
        connection = mysql.connector.connect(
            host="mazad-mysql-mazad-0524.a.aivencloud.com",
            database="mazad",
            user="avnadmin",
            password="AVNS_MeCGygQaQ80vJOt4tj5",
            port="12511",
        )
        
        now_utc = datetime.datetime.now(pytz.utc)

        # Convert UTC time to Jordan time (Asia/Amman)
        jordan_tz = pytz.timezone("Asia/Amman")
        nowInJordan = now_utc.astimezone(jordan_tz)

        cursor = connection.cursor()

        sql_select_Query = "SELECT id, itemId, startTime, finishTime FROM Auctions WHERE finishTime < %s AND isPaid = %s"
        cursor.execute(sql_select_Query, (nowInJordan.strftime('%Y-%m-%d %H:%M:%S'), False))

        records = cursor.fetchall()

        for row in records:
            # Option 1: Compare based on Jordan time
            jordan_finish_time = row[3].astimezone(jordan_tz)
            time_difference = nowInJordan - jordan_finish_time

            if time_difference.days > 2:
                # Get the last bid
                sql_select_Query = "SELECT userId FROM Bids WHERE auctionId = %s ORDER BY createdAt DESC LIMIT 1"
                cursor.execute(sql_select_Query, (row[0],))
                lastBid = cursor.fetchone()

                # Ban the user
                sql_select_Query = "UPDATE Users SET isBanned = %s WHERE id = %s"
                cursor.execute(sql_select_Query, (True, lastBid[0]))

            connection.commit()


        cursor.close()

    except Error as e:
        print("Error reading data from MySQL table", e)
    finally:
        if connection.is_connected():
            connection.close()
            print("MySQL connection is closed")


banUnpaiedUsers()