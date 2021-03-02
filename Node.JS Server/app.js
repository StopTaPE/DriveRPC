const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);
const express = require('express');
const bodyParser = require('body-parser');
const DiscordRPC = require('discord-rpc');
const app = express();

const clientId = '807310545291313163';
var rpc = new DiscordRPC.Client({ transport: 'ipc' });

var status = ""
var closed = true
var date = Date.now()

var oldDiscordPID = 0

setInterval(() => {
  run_shell_command("wmic process where name='discord.exe' get processid").then(data => {
    data = data["stdout"].replace("ProcessId", "").replace("\n", "")
    var discords = data.split("\n")
    var newDiscordPID = discords[discords.length - 3]
    var isCompared = discordPIDComparison(oldDiscordPID, newDiscordPID)
    if(!isCompared) {
      setTimeout(() => {
        var oldrpc = rpc
        oldrpc.destroy()
        rpc = new DiscordRPC.Client({ transport: 'ipc' });
        rpc.login({ clientId })
        rpc.on("ready", e => {
          rpc.setActivity({
            state: `${checkStatus(status)}`,
            startTimestamp: date,
            largeImageKey: 'big',
            smallImageKey: 'small',
            smallImageText: 'small',
            instance: false,
          });
        })
      }, 5000);
      setDiscordPID(newDiscordPID)
    }
  })
}, 500);

run_shell_command("wmic process where name='discord.exe' get processid").then(data => {
  data = data["stdout"].replace("ProcessId", "").replace("\n", "")
  var discords = data.split("\n")
  var discordPID = discords[discords.length - 3]
  setDiscordPID(discordPID)
})

setInterval(() => {
  var execc = require('child_process').exec;
  execc('tasklist', function (err, stdout, stderr) {
    if(!stdout.includes("chrome.exe") && !closed) {
      rpc.clearActivity()
      closed = true
      status = ""
    }
  });
}, 2000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.post('/drive', (req, res) => {
  res.send("Success")
  data = req.body.data.body
  if (data != "clear" && data != "resetstatus") {
    if (data != status && data != "") {
      date = Date.now()
      rpc.setActivity({
        state: `${data}`,
        startTimestamp: date,
        largeImageKey: 'big',
        smallImageKey: 'small',
        smallImageText: 'small',
        instance: false,
      });
      status = data
      if(closed) {
        closed = false
      }
    }
  } else if (data == "clear") {
    rpc.clearActivity();
    status = ""
  } else if (data == "resetstatus") {
    status = ""
  }
});

const port = 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  rpc.login({ clientId }).then(console.log(`${clientId} connected!`)).catch(e => {
    
  })
  rpc.on("ready", e => {
    rpc.setActivity({
      state: 'Starting The App...',
      startTimestamp: Date.now(),
      largeImageKey: 'big',
      smallImageKey: 'small',
      smallImageText: 'small',
      instance: false,
    });
  })
});

async function run_shell_command(command) {
  let result;
  try {
    result = await execProm(command);
  } catch(ex) {
     result = ex;
  }
  if ( Error[Symbol.hasInstance](result) )
      return ;

  return result;
}

function setDiscordPID(discord) {
 oldDiscordPID = discord
}

function discordPIDComparison(oldDiscordPID, newDiscordPID) {
 if(oldDiscordPID == newDiscordPID) {
   return true
 }
 return false
}

function checkStatus(state) {
  if(state == "") {
    return "Starting The App..."
  }else if(state == "Browsing...") {
    return "Browsing..."
  }else {
    return state
  }
}