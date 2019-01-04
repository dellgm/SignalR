using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalrPower.Hubs;
using System.Threading.Tasks;

namespace SignalrPower.Controllers
{
    public class AnnouncementController : Controller
    {
        private readonly IHubContext<MessageHub> _context;

        public AnnouncementController(IHubContext<MessageHub> context)
        {
            _context = context;
        }

        [HttpGet("/announcement")]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Post([FromForm] string message)
        {
            await _context.Clients.All.SendAsync("ReceiveMessage", message);
            return RedirectToAction("Index");
        }
    }
}