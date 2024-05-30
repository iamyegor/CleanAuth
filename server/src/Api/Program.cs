using Api;
using Application;
using Infrastructure.DapperConfigurations;

WebApplication.CreateBuilder(args).ConfigureServices().ConfigureMiddlewares().Run();
DapperConfiguration.ConfigureSnakeCaseMapping(typeof(IApplication).Assembly);

namespace Api
{
    public partial class Program { }
}
