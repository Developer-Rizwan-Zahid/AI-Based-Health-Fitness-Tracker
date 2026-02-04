using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;

        public AIController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        [HttpPost("recommend")]
        public async Task<IActionResult> Recommend([FromBody] object payload)
        {
            var client = _clientFactory.CreateClient();
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var resp = await client.PostAsync("http://127.0.0.1:8000/recommend", content);
                var body = await resp.Content.ReadAsStringAsync();
                return Content(body, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "AI service call failed", error = ex.Message });
            }
        }
    }
}
