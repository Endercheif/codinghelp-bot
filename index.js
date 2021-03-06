const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require("./config.json");

let connection;

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  console.log(file.slice(0, -3));
  const command = require(`./commands/${file.slice(0, -3)}`);
  client.commands.set(command.name, command);
}

client.on("ready", (guild) => {
  console.log(`${client.user.tag} is logged in and ready!`);
  const list = client.guilds.cache.get("359760149683896320");
  list.members.cache.forEach((m) => {
    console.log(m.user.username);
  });

  client.user.setPresence({
    status: "dnd",
    activity: {
      name: `++help`,
      type: "LISTENING",
    },
  });
});

client.on("guildCreate", async (guild) => {
  try {
    const list = client.guilds.cache.get("718253204147798047");
    list.members.cache.forEach((member) => {
      console.log(member.user.username);
    });
    /*await connection.query(
			`INSERT INTO Points (guildId, user) VALUES ('${guild.id}', '${users}')`
		);
    await connection.query(
			`INSERT INTO Challenges (guildId) VALUES ('${guild.id}')`
		);*/
  } catch (err) {
    console.log(err);
  }
});

client.on("error", function (err) {
  console.log("Global error handler called:\n");
  if (err) {
    console.log(err);
  }
});

client.on("message", async (message) => {
  // Looking for a message

  /* ----------------------------------------------------------
  NECESSARY PARTS OF THE FILE
  -------------------------------------------------------------- */
  if (!message.content.startsWith(config.client.prefix) || message.author.bot)
    return;

  const args = message.content
    .slice(config.client.prefix.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
}); // end of looking

(async () => {
  connection = await require("./database.js");
  await client.login(config.client.token);
})();
