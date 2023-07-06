---
layout: post
title: A quick SlackBot for saying hello on entering a channel
tags: [projects, web]
---

A group I joined on Slack was starting to write their own chatbot in order to automate some processes that happen manually whenever someone joins. Things like welcoming them to the channel and what not. I was curious, so I decided to try and write my own to see if I could.

I dug around for a couple hours trying to find documentation on hubot (which is hard because a) I don't know node.js and b) writing anything web-related has been a mental block for me) and eventually managed to write 5 lines of neat code:

```coffeescript
# set up hubot from here: https://hubot.github.com/docs/
module.exports = (robot) ->
  robot.enter (res) ->
    test_channel = robot.adapter.client.rtm.dataStore.getChannelByName '#general'
    if res.message.room == test_channel.id
        res.send 'Welcome <@' + res.message.user.id + '>! :tada:'
```

Let's start with the top - the first line declares that we have a bot going to do something.

The second line is where we tell Slack this bot will handle any messages that happen when someone enters a channel. When someone joins, the SlackBot is informed with an object called `res`. This object contains metadata about the person joining the channel, as well as the name of the channel itself.

In the third line, we reach into the Slack backend and pull out the metadata of the channel by its name. In this case, since we want to get everyone who joins, we simply enter `#general`, the name of the initial starter channel. We store that in a variable called `test_channel` for later.

In line 4, we check whether the room we entered was actually `general`. If it isn't we don't do anything. Otherwise, in line 5, we send our message.

What's interesting is the way we use to mention the person who joined. We have to surround their user ID (something like `U323W123`) with brackets and an @ sign to indicate we want to mention them. The final result ends up looking like `<@U323W123`> inside the string, which turns into a real user link.

To run our code, I installed the `hubot-slack` package and ran the command in my git root directory:

`HUBOT_SLACK_TOKEN=<slack token> ./bin/hubot --adapter slack`

Our final result for our 5 lines of code looks like this:

![SlackBot Result](https://i.imgur.com/f1kV4Jy.png)

Pretty neat for a few hours of digging.

In the future, I'm planning on doing more, adding features such as direct messaging to people with an intro doc, and more!
