using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestSharp;

namespace TelephonyIntegrationExample.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpGet]
        [Route("api/caller-data")]
        public ActionResult GetCallerData([FromQuery] string token, [FromQuery] string tel)
        {
            var client = new RestClient();
            var request = new RestRequest($"https://api.wizardsoft.com/api/telephony/lookup/{tel}", DataFormat.Json);
            request.AddHeader("Authorization", $"Bearer {token}");
            var res = client.Get(request);
            return Ok(res.Content);
        }
    }
}
