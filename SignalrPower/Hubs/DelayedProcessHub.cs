using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace SignalrPower.Hubs
{

    public class DelayedProcessHub : Hub
    {
        #region Traditional Hubs

        public async Task GetRandomNumberHubMethod(int numberOfNumbers)
        {
            var number = new List<int>();
            Random rnd = new Random();

            for (var x = 0; x < numberOfNumbers; x++)
            {
                number.Add(rnd.Next());
            }

            await Clients.Caller.SendAsync("Number", number);
        }
        #endregion

        #region GetRandomNumber

        public ChannelReader<int> GetRandomNumber(int numberOfNumbers, CancellationToken cancellationToken)
        {
            var channel = Channel.CreateUnbounded<int>();

            WriteRandomNumber(channel.Writer, numberOfNumbers, cancellationToken);

            return channel.Reader;
        }

        private async Task WriteRandomNumber(ChannelWriter<int> channelWriter, int numberOfNumbers, CancellationToken cancellationToken)
        {
            Random rnd = new Random();

            for (var x = 0; x < numberOfNumbers; x++)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await channelWriter.WriteAsync(rnd.Next(), cancellationToken);
            }

            channelWriter.TryComplete();
        }

        #endregion

        #region GetUsers
        public ChannelReader<string> GetUsers(int userCount, CancellationToken cancellationToken)
        {
            var channel = Channel.CreateBounded<string>(5);

            WriteUsers(channel.Writer, userCount, cancellationToken);

            return channel.Reader;
        }

        private async Task WriteUsers(ChannelWriter<string> channelWriter, int userCount, CancellationToken cancellationToken)
        {
            for (var x = 0; x < userCount; x++)
            {
                cancellationToken.ThrowIfCancellationRequested();

                using (HttpClient client = new HttpClient())
                {
                    var json = await client.GetStringAsync("https://randomuser.me/api/");
                    var parsed = JObject.Parse(json);

                    var results = parsed["results"];
                    var name = results[0]["name"];
                    var first = name["first"];
                    var last = name["last"];

                    await channelWriter.WriteAsync($"{first} {last}", cancellationToken);
                }
            }

            channelWriter.TryComplete();
        }

        #endregion
    }
}
