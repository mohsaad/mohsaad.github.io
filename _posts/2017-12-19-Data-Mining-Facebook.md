---
layout: post
title: Data-mining your Facebook Data
---

One of the topics I've always been interested in was the amount of content that's on Facebook. Facebook is a huge platform that I've been on since 2009 (8 years ago... what a long time). In that time, I've put a lot of stuff on Facebook, whether that's Messenger or posts I've shared. I was curious about how much I've actually put on there, and whether that can be data-mined to find information on various people I've known. Could we, for example, figure out our "top friends"? Would it be possible to cluster people based on various interactions with them?

Facebook actually makes it kind of handy to try and figure this out. You can [download](https://www.facebook.com/help/212802592074644) your Facebook data, which is the sum of your posts, photos, videos, messages, and likes. The data comes in various HTML files, and can be opened in your web browser with a nice, Facebook-like layout. This also allows us to data-mine our accounts, and see how much stuff we've put on there, and most importantly, when.

### Finding your friends

Thankfully, Facebook already has a `friends.htm` file that contains a list of all your friends, whether you've added, removed, or requested. With that, we're able to compile a list of our friends using `BeautifulSoup`:


```python
f = open('html/friends.htm')
soup = BeautifulSoup(f, 'html5lib')
friend_list = soup.find_all('ul')[1]
friend_list_pending = soup.find_all('ul')[2]
friend_list_request = soup.find_all('ul')[3]
friend_list_removed = soup.find_all('ul')[4]
```

Now, we can iterate through each of these tags, getting the name and the add date (or the removed date, if the friend is someone we removed):

```python
for name in friend_list.children:
    name_str = name.text

    str_array = name_str.split('[')
    if(len(str_array) != 1):
        real_str = str_array[0] + str_array[1].split(']')[1]
        name = str_array[0].replace(' ', '')
        date_added = str_array[1].split(']')[1].split('(')[1].split(')')[0]
    else:
        real_str = str_array[0]
        name = str_array[0].split('(')[0].replace(' ', '')
        date_added = str_array[0].split('(')[1].split(')')[0]

    date_arr = date_added.split(',')
    month = month_dict[date_arr[0].split(' ')[0]]
    day = int(date_arr[0].split(' ')[1])
    if(len(date_arr) == 1):
        year = 2017
    else:
        year = int(date_arr[1].replace(' ', ''))

    if name not in people:
        people[name] = {}
        people[name]['num_messages'] = 0

    people[name]['date_added'] = {}
    people[name]['date_added']['day'] = day
    people[name]['date_added']['month'] = month
    people[name]['date_added']['year'] = year
```

With this, we already have a lot of data. Let's dump it to a JSON file for safekeeping:

```python
with open('people.json', 'w') as fp:
    json.dump(people, fp)
```

Now, we can find the number of friends we added per year, and plot it:

```python
# bar chart of people added per year
num_friends_per_year = {}
for person in people:
    if 'date_added' in people[person]:
        if people[person]['date_added']['year'] not in num_friends_per_year:
            num_friends_per_year[people[person]['date_added']['year']] = 1
        else:
            num_friends_per_year[people[person]['date_added']['year']] += 1

sorted_dictionary = collections.OrderedDict(sorted(num_friends_per_year.items()))
years_arr = sorted_dictionary.keys()
friends_per_year_arr = sorted_dictionary.values()

x = np.arange(len(years_arr))
plt.bar(x, friends_per_year_arr)
plt.xticks(x, years_arr)
plt.xlabel('Year')
plt.ylabel('Number of Added Friends')
plt.title('Number of added friends per year')
plt.show()
```

The resulting figure looks like this (for my 8 years):

![Imgur](https://i.imgur.com/Lx1SB62.png)

### Analyzing Timelines of Facebook Messages

Another idea I had was to see what happened to all the Facebook messages I used to exchange with old friends. I was curious to see when the tide ended between High School, College, and post-college (aka getting a job). I figured it would be a bell-curve, but it was something interesting to prove anyways.

In the data provided, each message is stored as a single file, allowing us to traverse the directory and pick up all our messages. Doing that, we can extract the name of the person we're having a message with, as well as the metadata regarding the conversation, including the date and time of the post. For now, I don't include content, as doing that would add a huge amount of data that I'm not sure what to do with yet.

(Note: you can also go to `html/messages.htm` and get each message ID and associate each conversation with that. That's probably easier.)

One thing to note is that I disregarded group conversations here, as I was comparing individual friends. To do group conversations, you'd have to do a bit more processing on each message file, but it ultimately would just involve figuring out who said what and putting it in the right index. Onto the code:

```python
month_dict = {'Jan' : 1, 'Feb' : 2, 'Mar' : 3, 'Apr' : 4, 'May' : 5, 'Jun' : 6,
                'Jul' : 7, 'Aug' : 8, 'Sep' : 9, 'Oct' : 10, 'Nov' : 11, 'Dec' : 12,
                'January' : 1, 'February' : 2, 'March' : 3, 'April' : 4, 'May' : 5,
                'June' : 6, 'July' : 7, 'August' : 8, 'September' : 9, 'October' : 10,
                'November' : 11, 'December' : 12}


conversations = os.listdir('html/messages/')
for i in range(0, len(conversations)):
    f = open('{0}/{1}'.format('html/messages', conversations[i]))
    soup = BeautifulSoup(f, 'html5lib')
    person = soup.find('title').text.split("with ")[1].replace(' ', '')
    if(len(person.split(',')) == 1):
        people[person] = {}
        people[person]['num_messages'] = len(soup.find_all('p'))
        people[person]['message_years'] = {}

        # index all messages of a person based on year/month/day
        for timestamp in soup.findAll(attrs={'class': 'meta'}):
            msg_year = int(timestamp.text.split(',')[2].split('at')[0].replace(' ', ''))
            msg_month = month_dict[timestamp.text.split(',')[1].split(' ')[1].replace(' ', '')]
            msg_day = int(timestamp.text.split(',')[1].split(' ')[2].replace(' ', ''))

            if msg_year not in people[person]['message_years']:
                people[person]['message_years'][msg_year] = { msg_month : { msg_day : 1 }}
            else:
                if msg_month not in people[person]['message_years'][msg_year]:
                    people[person]['message_years'][msg_year][msg_month] = {msg_day : 1}
                else:
                    if msg_day not in people[person]['message_years'][msg_year][msg_month]:
                        people[person]['message_years'][msg_year][msg_month][msg_day] = 1
                    else:
                        people[person]['message_years'][msg_year][msg_month][msg_day] += 1

    f.close()
    print('{0}/{1} finished'.format(i, len(conversations)))
```

This takes a while - for my 1,000 friends, about 5 minutes to process all the message files.

Now, using all that data, we can plot things like our message consistency over time:

```python
# setup
import matplotlib.pyplot as plt
import numpy as np
months = [1,2,3,4,5,6,7,8,9,10,11,12]
years = [2009,2010,2011,2012,2013,2014,2015,2016,2017]
month_year_map = {}
for i in range(0, len(years)):
    month_year_map[years[i]] = {}

msgs_per_month_year = []
months_years = []
for i in range(0, len(years)):
    for j in range(0, len(months)):
        msgs_per_month_year.append(0)
        months_years.append('{0}/{1}'.format(str(months[j]), str(years[i])))
        month_year_map[years[i]][months[j]] = len(msgs_per_month_year) - 1

# actual plotting
if int(people[friend]['num_messages']) != 0:
    for year in people[friend]['message_years']:
        for month in people[friend]['message_years'][year]:
            for day in people[friend]['message_years'][year][month]:
                msgs_per_month_year[month_year_map[int(year)][int(month)]] += people[friend]['message_years'][year][month][day]

    if 'date_added' in people[friend]:
        friend_add_month = int(people[friend]['date_added']['month'])
        friend_add_year = int(people[friend]['date_added']['year'])

        # add a red line to indicate when friend was added
        plt.axvline(month_year_map[friend_add_year][friend_add_month], color = 'r')

        truncated_msgs = msgs_per_month_year[month_year_map[friend_add_year][friend_add_month]:-1]
        months_as_friends = months_years[month_year_map[friend_add_year][friend_add_month]:-1]



    x = np.arange(len(msgs_per_month_year))
    plt.bar(x, height = msgs_per_month_year)

    plt.xticks([6, 18, 30, 42, 54, 66, 78, 90, 102], [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017])
    plt.xlabel('Year')
    plt.ylabel('Number of messages exchanged')
    plt.show()
else:
    print('No messages shared.')
```

With this, we can get a bar chart of how many messages were exchanged over time with friends. For example, here's a bar chart of a friend from high school:

![Imgur](https://i.imgur.com/dPMVHeE.png)

And a friend from college:

![Imgur](https://i.imgur.com/Y5CDg5Z.png)

And a friend from both:

![Imgur](https://i.imgur.com/xHBu3Mj.png)

It's interesting to see how the plots change over time, and how people (or at least me) stop communicating as they go their separate ways. You can almost predict where someone moves or changes jobs or schools, which I find cool.

### Finding top friends

Finally, we get to ranking our top friends. This one actually is pretty easy, as we just sort our dictionary by the most number of messages:

```python
sorted_people = sorted(people.items(), key = lambda x : x[1]['num_messages'], reverse = True)

top = 10
print('Top {0} communicators'.format(top))
for i in range(0, top):
   print('{0}: {1}'.format(sorted_people[i][0].encode('utf-8'), sorted_people[i][1]['num_messages']))

# Number of people you have exchanged at least 2 messages with
min_messages = 100
count = 0
for i in range(0, len(sorted_people)):
    if(sorted_people[i][1]['num_messages'] < min_messages):
        count += 1
        break
    count = i

print("Number of people you have exchanged at least {0} messages with: {1}".format(min_messages, count))
```
This will give us a result (with names hidden for privacy):

```
Top 10 communicators
1: 77007
2: 34341
3: 30566
4: 29247
5: 20925
6: 19285
7: 17234
8: 15125
9: 13207
10: 12712
Number of people you have exchanged at least 100 messages with: 174
```

### Resources

The scripts used to generate the plots can be found on [GitHub](https://github.com/mohsaad/facebook-data-mining).

### To-do ideas
* Generate clusters based on similar add/remove dates
* Predict who was in each cluster based on message times
* Add groups to improve message tracking
