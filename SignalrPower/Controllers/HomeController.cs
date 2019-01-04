using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalrPower.Hubs;

namespace SignalrPower.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHubContext<DelayedProcessHub> _hubContext;

        public HomeController(IHubContext<DelayedProcessHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}