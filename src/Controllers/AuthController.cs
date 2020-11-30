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

        [HttpGet]
        [Route("api/jobs/contact/open/{id}")]
        public ActionResult GetContactOpenJobs([FromRoute] string id, [FromQuery] string token)
        {
            var client = new RestClient();
            var request = new RestRequest($"https://api.wizardsoft.com/api/jobs/contact/open/{id}", DataFormat.Json);
            request.AddHeader("Authorization", $"Bearer {token}");
            var res = client.Get(request);
            return Ok(res.Content);
        }

        [HttpGet]
        [Route("api/jobs/candidate/open/{id}")]
        public ActionResult GetCandidateOpenJobs([FromRoute] string id, [FromQuery] string token)
        {
            var client = new RestClient();
            var request = new RestRequest($"https://api.wizardsoft.com/api/jobs/contact/open/{id}", DataFormat.Json);
            request.AddHeader("Authorization", $"Bearer {token}");
            var res = client.Get(request);
            return Ok(res.Content);
        }

        [HttpPost]
        [Route("api/activities")]
        public ActionResult CreateActivity([FromBody]object data, [FromQuery] string token)
        {
            var client = new RestClient();
            var request = new RestRequest("https://api.wizardsoft.com/api/activities", Method.POST, DataFormat.Json);
            request.AddHeader("Authorization", $"Bearer {token}");
            request.AddParameter("application/json; charset=utf-8", data, ParameterType.RequestBody);
            var res = client.Post(request);
            return Ok(res.Content);
        }
    }
}
