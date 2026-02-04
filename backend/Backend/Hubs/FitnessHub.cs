using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public class FitnessHub : Hub
    {
        public async Task BroadcastActivity(int userId, string type, string payload)
        {
            await Clients.All.SendAsync("ReceiveUpdate", userId, type, payload);
        }
    }
}
